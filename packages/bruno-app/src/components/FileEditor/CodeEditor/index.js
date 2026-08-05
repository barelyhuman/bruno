/**
 * Collection file-mode editor (.bru plain text / .yml|.yaml) — CodeMirror 6.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { getAllVariables } from 'utils/collections';
import BrunoCodeEditor, { PRESETS } from 'components/BrunoCodeEditor';
import CodeMirrorSearch6 from 'components/CodeMirrorSearch6';
import { brunoVariablesHighlight } from 'utils/codemirror6/extensions/brunoVariablesHighlight';
import { brunoVarInfo } from 'utils/codemirror6/extensions/brunoVarInfo';
import { searchMarksExtension } from 'components/CodeMirrorSearch6/searchMarksExtension';
import { getSelectionText, getCursorLineCh } from 'components/CodeMirrorSearch6/posUtils';
import StyledWrapper from './StyledWrapper';

const SERVER_RENDERED = typeof window === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

export default function CodeEditor({
  value = '',
  mode = 'application/text',
  theme,
  readOnly = false,
  onEdit,
  font,
  initialScroll = 0,
  onScroll,
  toggleFileMode,
  collection,
  item
}) {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [editorView, setEditorView] = useState(null);
  const searchBarRef = useRef(null);
  const editorViewRef = useRef(null);
  const searchVisibleRef = useRef(false);
  const readOnlyRef = useRef(readOnly);
  const openSearchRef = useRef(() => {});
  const openReplaceRef = useRef(() => {});
  const varInfoOptionsRef = useRef({});
  searchVisibleRef.current = searchBarVisible;
  readOnlyRef.current = readOnly;

  const variables = getAllVariables(collection, item);
  varInfoOptionsRef.current = { variables, collection, item };

  const openSearch = useCallback(() => {
    const view = editorViewRef.current;
    if (!view) return;
    const selected = getSelectionText(view);
    const cursor = getCursorLineCh(view);
    setSearchBarVisible(true);
    setTimeout(() => {
      if (selected) {
        searchBarRef.current?.setSearch(selected, cursor);
      } else {
        searchBarRef.current?.focusAtCursor(cursor);
      }
    }, 0);
  }, []);

  const openReplace = useCallback(() => {
    if (readOnlyRef.current) return;
    setSearchBarVisible(true);
    setTimeout(() => {
      searchBarRef.current?.focus();
      searchBarRef.current?.openReplace();
    }, 0);
  }, []);

  openSearchRef.current = openSearch;
  openReplaceRef.current = openReplace;

  const extraExtensions = useMemo(() => [
    brunoVariablesHighlight(variables, { highlightPathParams: false }),
    // Stable getter so we don't rebuild the tooltip extension every variables change
    ...brunoVarInfo(() => varInfoOptionsRef.current),
    searchMarksExtension,
    Prec.highest(keymap.of([
      { key: 'Mod-f', run: () => {
        openSearchRef.current(); return true;
      } },
      { key: 'Ctrl-h', run: () => {
        openReplaceRef.current(); return true;
      } },
      { key: 'Mod-Alt-f', run: () => {
        openReplaceRef.current(); return true;
      } },
      {
        key: 'Escape',
        run: () => {
          if (searchVisibleRef.current) {
            searchBarRef.current?.close();
            return true;
          }
          return false;
        }
      },
      ...(toggleFileMode
        ? [{ key: 'Shift-Mod-m', run: () => {
            toggleFileMode(); return true;
          } }]
        : [])
    ]))
  ], [variables, toggleFileMode]);

  const handleChange = useCallback((newValue) => {
    onEdit?.(newValue);
  }, [onEdit]);

  const handleViewRef = useCallback((view) => {
    editorViewRef.current = view;
    setEditorView(view);
    if (view && initialScroll) {
      view.scrollDOM.scrollTop = initialScroll;
    }
    if (view && onScroll) {
      view.scrollDOM.addEventListener('scroll', () => {
        onScroll(view.scrollDOM.scrollTop);
      });
    }
  }, [initialScroll, onScroll]);

  if (SERVER_RENDERED) {
    return <StyledWrapper className="h-full w-full" aria-label="Code Editor" font={font} />;
  }

  return (
    <StyledWrapper className="h-full w-full" aria-label="Code Editor" font={font}>
      <CodeMirrorSearch6
        ref={searchBarRef}
        visible={searchBarVisible}
        view={editorView}
        value={value}
        readOnly={readOnly}
        onClose={() => setSearchBarVisible(false)}
      />
      <BrunoCodeEditor
        ref={handleViewRef}
        value={value}
        mode={mode}
        theme={theme}
        readOnly={readOnly}
        onChange={handleChange}
        preset={PRESETS.FILE}
        font={font}
        enableLint={Boolean(value?.trim())}
        extraExtensions={extraExtensions}
      />
    </StyledWrapper>
  );
}
