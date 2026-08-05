import { keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine, drawSelection, EditorView } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  foldGutter,
  foldKeymap,
  bracketMatching,
  indentOnInput
} from '@codemirror/language';
import { lintGutter } from '@codemirror/lint';
import { search, searchKeymap, openSearchPanel } from '@codemirror/search';
import { EditorState, Prec } from '@codemirror/state';

/**
 * Standard Bruno editor extensions shared across presets.
 */
export function baseSetup({
  lineNumbers: showLineNumbers = true,
  lintGutter: showLintGutter = false,
  enableSearch = false,
  tabSize
} = {}) {
  const extensions = [
    history(),
    drawSelection(),
    indentOnInput(),
    bracketMatching(),
    highlightActiveLine(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...searchKeymap,
      indentWithTab
    ])
  ];

  if (enableSearch) {
    extensions.push(search({ top: true }));
  }

  if (showLineNumbers) {
    extensions.push(lineNumbers(), highlightActiveLineGutter(), foldGutter());
  }

  if (showLintGutter) {
    extensions.push(lintGutter());
  }

  if (tabSize !== null) {
    extensions.push(EditorState.tabSize.of(tabSize));
  }

  return extensions;
}

export function lineWrappingExtension() {
  return EditorView.lineWrapping;
}

export function tabKeymapExtension() {
  return Prec.highest(keymap.of([
    {
      key: 'Tab',
      run: (view) => {
        const { state } = view;
        const selection = state.selection.main;
        const selected = state.sliceDoc(selection.from, selection.to);
        if (selected.includes('\n') || state.doc.lineAt(selection.from).text === selected) {
          return indentWithTab.run(view);
        }
        view.dispatch(state.replaceSelection('  '));
        return true;
      }
    },
    {
      key: 'Shift-Tab',
      run: (view) => {
        const { state } = view;
        const selection = state.selection.main;
        const line = state.doc.lineAt(selection.from);
        const lineText = line.text;
        if (lineText.startsWith('  ')) {
          view.dispatch({
            changes: { from: line.from, to: line.from + 2, insert: '' },
            selection: { anchor: Math.max(line.from, selection.anchor - 2) }
          });
          return true;
        }
        return false;
      }
    }
  ]));
}

export function searchKeymapExtension() {
  return keymap.of([
    { key: 'Mod-f', run: openSearchPanel },
    { key: 'Mod-Alt-f', run: openSearchPanel },
    { key: 'Ctrl-h', run: openSearchPanel }
  ]);
}

export function readOnlyExtension(readOnly) {
  if (!readOnly) return [];
  if (readOnly === 'nocursor') {
    return [
      EditorState.readOnly.of(true),
      EditorView.editable.of(false)
    ];
  }
  return [EditorState.readOnly.of(true)];
}

export function mousetrapExtension() {
  return EditorView.domEventHandlers({
    focus(event, view) {
      view.contentDOM.classList.add('mousetrap');
      return false;
    }
  });
}
