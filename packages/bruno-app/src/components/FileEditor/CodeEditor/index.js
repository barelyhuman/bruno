/**
 * File editor (env dotenv) — migrated to CodeMirror 6.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { keymap } from '@codemirror/view';
import { getEnvironmentVariables } from 'utils/collections';
import BrunoCodeEditor, { PRESETS } from 'components/BrunoCodeEditor';
import CodeMirrorSearch6 from 'components/CodeMirrorSearch6';
import { brunoVariablesHighlight } from 'utils/codemirror6/extensions/brunoVariablesHighlight';
import { createCm5Compat } from 'utils/codemirror6/compat';
import StyledWrapper from './StyledWrapper';

const SERVER_RENDERED = typeof window === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

export default function CodeEditor({
  value = '',
  mode = 'application/ld+json',
  theme,
  readOnly = false,
  onEdit,
  font,
  initialScroll = 0,
  onScroll,
  toggleFileMode,
  collection
}) {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const searchBarRef = useRef(null);
  const viewRef = useRef(null);
  const cachedValueRef = useRef(value);
  const searchVisibleRef = useRef(false);
  const readOnlyRef = useRef(readOnly);
  searchVisibleRef.current = searchBarVisible;
  readOnlyRef.current = readOnly;

  const variables = getEnvironmentVariables(collection);

  const openSearch = useCallback(() => {
    const compat = createCm5Compat(viewRef.current);
    if (!compat) return;
    const selected = compat.getSelection();
    const cursor = compat.getCursor('from');
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

  const extraExtensions = useMemo(() => {
    const exts = [brunoVariablesHighlight(variables, { highlightPathParams: false })];
    exts.push(
      keymap.of([
        { key: 'Mod-f', run: () => {
          openSearch(); return true;
        } },
        { key: 'Ctrl-h', run: () => {
          openReplace(); return true;
        } },
        { key: 'Mod-Alt-f', run: () => {
          openReplace(); return true;
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
      ])
    );
    return exts;
  }, [variables, openSearch, openReplace, toggleFileMode]);

  const handleChange = useCallback((newValue) => {
    cachedValueRef.current = newValue;
    onEdit?.(newValue);
  }, [onEdit]);

  const handleViewRef = useCallback((view) => {
    viewRef.current = view;
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
        view={viewRef.current}
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
