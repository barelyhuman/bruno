import { StateEffect, StateField, RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView, WidgetType } from '@codemirror/view';

const MARKS_UPDATE = StateEffect.define();
const LINE_CLASS_UPDATE = StateEffect.define();

function lineChToPos(doc, line, ch) {
  const lineInfo = doc.line(Math.min(line + 1, doc.lines));
  return lineInfo.from + Math.min(ch, lineInfo.length);
}

function posToLineCh(doc, pos) {
  const line = doc.lineAt(pos);
  return { line: line.number - 1, ch: pos - line.from };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class CompatWidget extends WidgetType {
  constructor(node) {
    super();
    this.node = node;
  }

  eq(other) {
    return other.node === this.node;
  }

  toDOM() {
    return this.node;
  }
}

function buildMarkDecorations(marks, doc) {
  const builder = new RangeSetBuilder();
  const sorted = [...marks].sort((a, b) => a.from - b.from);
  for (const mark of sorted) {
    if (mark.removed) continue;
    const opts = mark.options || {};
    let deco;
    if (opts.replacedWith) {
      deco = Decoration.replace({ widget: new CompatWidget(opts.replacedWith), inclusive: false });
    } else {
      const attrs = { ...(opts.attributes || {}) };
      if (opts.className) attrs.class = opts.className;
      deco = Decoration.mark({ class: opts.className, attributes: attrs });
    }
    builder.add(mark.from, mark.to, deco);
  }
  return builder.finish();
}

function buildLineDecorations(lineClasses, doc) {
  const builder = new RangeSetBuilder();
  for (const [line, classes] of lineClasses.entries()) {
    if (!classes?.size) continue;
    try {
      const docLine = doc.line(line + 1);
      builder.add(
        docLine.from,
        docLine.from,
        Decoration.line({ class: [...classes].join(' ') })
      );
    } catch {
      // line out of range
    }
  }
  return builder.finish();
}

const compatMarksField = StateField.define({
  create() {
    return { marks: [], decorations: Decoration.none };
  },
  update(value, tr) {
    let marks = value.marks;
    let changed = false;
    for (const effect of tr.effects) {
      if (effect.is(MARKS_UPDATE)) {
        marks = effect.value;
        changed = true;
      }
    }
    if (!changed && !tr.docChanged) return value;
    if (tr.docChanged) {
      marks = marks.map((m) => {
        if (m.removed) return m;
        return {
          ...m,
          from: tr.changes.mapPos(m.from, 1),
          to: tr.changes.mapPos(m.to, -1)
        };
      });
    }
    return {
      marks,
      decorations: buildMarkDecorations(marks, tr.newDoc)
    };
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.decorations)
});

const compatLineClassField = StateField.define({
  create() {
    return { map: new Map(), decorations: Decoration.none };
  },
  update(value, tr) {
    let map = value.map;
    for (const effect of tr.effects) {
      if (effect.is(LINE_CLASS_UPDATE)) {
        map = effect.value;
      }
    }
    return {
      map,
      decorations: buildLineDecorations(map, tr.newDoc)
    };
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.decorations)
});

export function compatExtension() {
  return [compatMarksField, compatLineClassField];
}

/**
 * CM5-compatible editor facade for legacy Bruno utilities (autocomplete, masking, search).
 */
export function createCm5Compat(view) {
  if (!view) return null;
  if (view._cm5Compat) return view._cm5Compat;

  const listeners = {
    change: [],
    scroll: [],
    inputRead: [],
    beforeChange: [],
    cursorActivity: [],
    selectionChange: [],
    keyup: [],
    mousedown: [],
    paste: [],
    blur: [],
    refresh: [],
    fold: [],
    unfold: [],
    autocomplete: []
  };

  const compat = {
    state: {},
    options: {},
    view,

    getWrapperElement: () => view.dom,
    getInputField: () => view.contentDOM,
    getDoc: () => compat,

    getValue: () => view.state.doc.toString(),
    setValue: (val) => {
      const current = view.state.doc.toString();
      view.dispatch({ changes: { from: 0, to: current.length, insert: val ?? '' } });
    },

    getLine: (line) => {
      try {
        return view.state.doc.line(line + 1).text;
      } catch {
        return '';
      }
    },

    lineCount: () => view.state.doc.lines,
    lastLine: () => view.state.doc.lines - 1,

    getCursor: (which) => {
      const sel = view.state.selection.main;
      const pos = which === 'to' ? sel.to : which === 'from' ? sel.from : sel.head;
      return posToLineCh(view.state.doc, pos);
    },

    setCursor: (pos, ch) => {
      const line = typeof pos === 'number' ? pos : pos.line;
      const column = typeof pos === 'number' ? ch : pos.ch;
      const offset = lineChToPos(view.state.doc, line, column);
      view.dispatch({ selection: { anchor: offset } });
    },

    getSelection: () => {
      const { from, to } = view.state.selection.main;
      return view.state.sliceDoc(from, to);
    },

    replaceSelection: (text) => {
      view.dispatch(view.state.replaceSelection(text));
    },

    replaceRange: (text, from, to) => {
      const fromPos = lineChToPos(view.state.doc, from.line, from.ch);
      const toPos = lineChToPos(view.state.doc, to.line, to.ch);
      view.dispatch({ changes: { from: fromPos, to: toPos, insert: text } });
    },

    indexFromPos: (pos) => lineChToPos(view.state.doc, pos.line, pos.ch),
    posFromIndex: (idx) => posToLineCh(view.state.doc, idx),

    markText: (from, to, options = {}) => {
      const fromPos = lineChToPos(view.state.doc, from.line, from.ch);
      const toPos = lineChToPos(view.state.doc, to.line, to.ch);
      const mark = { from: fromPos, to: toPos, options, removed: false };
      const marksState = view.state.field(compatMarksField, false);
      const marks = [...(marksState?.marks || []), mark];
      view.dispatch({ effects: MARKS_UPDATE.of(marks) });
      mark.clear = () => {
        mark.removed = true;
        const current = view.state.field(compatMarksField, false)?.marks || [];
        view.dispatch({ effects: MARKS_UPDATE.of(current.filter((m) => m !== mark)) });
      };
      mark.find = () => ({
        from: posToLineCh(view.state.doc, mark.from),
        to: posToLineCh(view.state.doc, mark.to)
      });
      return mark;
    },

    getAllMarks: () => {
      const marksState = view.state.field(compatMarksField, false);
      return (marksState?.marks || []).filter((m) => !m.removed).map((m) => ({
        clear: () => m.clear?.(),
        find: () => ({
          from: posToLineCh(view.state.doc, m.from),
          to: posToLineCh(view.state.doc, m.to)
        }),
        className: m.options?.className
      }));
    },

    addLineClass: (line, _where, className) => {
      const lineState = view.state.field(compatLineClassField, false);
      const map = new Map(lineState?.map || []);
      const set = new Set(map.get(line) || []);
      set.add(className);
      map.set(line, set);
      view.dispatch({ effects: LINE_CLASS_UPDATE.of(map) });
    },

    removeLineClass: (line, _where, className) => {
      const lineState = view.state.field(compatLineClassField, false);
      const map = new Map(lineState?.map || []);
      const set = new Set(map.get(line) || []);
      set.delete(className);
      if (set.size) map.set(line, set);
      else map.delete(line);
      view.dispatch({ effects: LINE_CLASS_UPDATE.of(map) });
    },

    getViewport: () => {
      const { scrollDOM } = view;
      const fromLine = view.lineBlockAtHeight(scrollDOM.scrollTop).from;
      const toLine = view.lineBlockAtHeight(scrollDOM.scrollTop + scrollDOM.clientHeight).to;
      return {
        from: posToLineCh(view.state.doc, fromLine).line,
        to: posToLineCh(view.state.doc, toLine).line
      };
    },

    scrollIntoView: (pos, margin = 0) => {
      const offset = typeof pos.line === 'number'
        ? lineChToPos(view.state.doc, pos.line, pos.ch || 0)
        : pos;
      view.dispatch({
        effects: EditorView.scrollIntoView(offset, { y: 'center', yMargin: margin })
      });
    },

    scrollTo: (_x, y) => {
      if (y != null) view.scrollDOM.scrollTop = y;
    },

    getScrollInfo: () => ({
      top: view.scrollDOM.scrollTop,
      left: view.scrollDOM.scrollLeft,
      height: view.scrollDOM.scrollHeight,
      width: view.scrollDOM.scrollWidth,
      clientHeight: view.scrollDOM.clientHeight,
      clientWidth: view.scrollDOM.clientWidth
    }),

    coordsChar: (point) => {
      const pos = view.posAtCoords({ x: point.left, y: point.top });
      if (pos == null) return { line: 0, ch: 0 };
      return posToLineCh(view.state.doc, pos);
    },

    refresh: () => view.requestMeasure(),
    focus: () => view.focus(),

    operation: (fn) => fn(),

    setOption: (key, val) => {
      const old = compat.options[key];
      compat.options[key] = val;
      try {
        const CodeMirror = require('codemirror');
        if (CodeMirror.optionHandlers?.[key]) {
          CodeMirror.optionHandlers[key](compat, val, old === undefined ? CodeMirror.Init : old);
        }
      } catch {
        // codemirror package removed — option hooks unavailable
      }
    },

    getOption: (key) => compat.options[key],

    on: (event, handler) => {
      if (listeners[event]) {
        listeners[event].push(handler);
        if (event === 'change') compat._changeListeners = listeners.change;
      }
    },

    off: (event, handler) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      }
    },

    execCommand: (cmd) => {
      if (cmd === 'autocomplete') {
        listeners.autocomplete.forEach((h) => h(compat));
      }
    },

    foldCode: (from) => {
      try {
        const pos = lineChToPos(view.state.doc, from.line, from.ch);
        view.dispatch({ effects: EditorView.scrollIntoView(pos) });
      } catch {
        // ignore
      }
    },

    getSearchCursor: (query, startPos, options = {}) => {
      const doc = compat.getValue();
      let index = lineChToPos(view.state.doc, startPos.line, startPos.ch);
      let regex;
      if (query instanceof RegExp) {
        regex = new RegExp(query.source, query.flags.includes('g') ? query.flags : query.flags + 'g');
      } else if (options.caseFold) {
        regex = new RegExp(escapeRegex(query), 'gi');
      } else {
        regex = new RegExp(escapeRegex(query), 'g');
      }

      return {
        findNext: () => {
          const slice = doc.slice(index);
          regex.lastIndex = 0;
          const match = regex.exec(slice);
          if (!match) return false;
          const from = index + match.index;
          const to = from + match[0].length;
          index = to;
          return {
            from: () => posToLineCh(view.state.doc, from),
            to: () => posToLineCh(view.state.doc, to)
          };
        }
      };
    },

    setSelection: (from, to, opts = {}) => {
      const fromPos = lineChToPos(view.state.doc, from.line, from.ch);
      const toPos = lineChToPos(view.state.doc, to.line, to.ch);
      view.dispatch({
        selection: { anchor: fromPos, head: toPos },
        scrollIntoView: !opts.scroll
      });
    }
  };

  if (!view._compatScrollAttached) {
    view._compatScrollAttached = true;
    view.scrollDOM.addEventListener('scroll', () => {
      listeners.scroll.forEach((h) => h(compat));
    });
    view.dom.addEventListener('keyup', (e) => {
      listeners.keyup.forEach((h) => h(compat, e));
    });
    view.dom.addEventListener('mousedown', (e) => {
      listeners.mousedown.forEach((h) => h(compat, e));
    });
    view.contentDOM.addEventListener('paste', (e) => {
      listeners.paste.forEach((h) => h(compat, e));
    });
    view.contentDOM.addEventListener('blur', (e) => {
      listeners.blur.forEach((h) => h(compat, e));
    });
  }

  view._cm5Compat = compat;
  return compat;
}
