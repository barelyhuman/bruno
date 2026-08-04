/**
 * Main Bruno code editor — migrated to CodeMirror 6.
 */

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { keymap } from '@codemirror/view';
import { indentLess, indentMore } from '@codemirror/commands';
import { getAllVariables } from 'utils/collections';
import { buildAutocompleteContext } from 'utils/ai';
import BrunoCodeEditor, { PRESETS } from 'components/BrunoCodeEditor';
import CodeMirrorSearch6 from 'components/CodeMirrorSearch6';
import { createCm5Compat } from 'utils/codemirror6/compat';
import { brunoVariablesHighlight } from 'utils/codemirror6/extensions/brunoVariablesHighlight';
import { setupAutoComplete6, showRootHints } from 'utils/codemirror6/extensions/autocomplete';
import { setupAiAutocomplete6 } from 'utils/codemirror6/extensions/aiGhostText';
import { setupBrunoVarInfo6 } from 'utils/codemirror6/extensions/brunoVarInfo';
import { setupLinkAware6 } from 'utils/codemirror6/extensions/linkAware';
import { setupLintErrorTooltip6 } from 'utils/codemirror6/extensions/lintTooltips';
import { setupCodeMirrorResizeRefresh } from 'utils/codemirror6/extensions/resizeRefresh';
import { captureEditorState6, applyEditorState6 } from 'utils/codemirror6/extensions/editorPersistence';
import {
  getDocKey,
  readPersistedEditorState,
  writePersistedEditorState
} from './state-persistence';
import { usePersistenceScope } from 'hooks/usePersistedState/PersistedScopeProvider';
import StyledWrapper from './StyledWrapper';

const CodeEditor = forwardRef(function CodeEditor(
  {
    value = '',
    mode = 'application/ld+json',
    theme,
    readOnly = false,
    onEdit,
    onScroll,
    initialScroll = 0,
    containScroll = false,
    collection,
    item,
    font,
    fontSize,
    enableBrunoVarInfo = true,
    enableVariableHighlighting = true,
    showHintsFor,
    scriptType,
    aiPreferences,
    persistenceScope,
    docKey: docKeyProp,
    testId,
    onSearchBarVisibilityChange
  },
  ref
) {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const searchBarRef = useRef(null);
  const viewRef = useRef(null);
  const compatRef = useRef(null);
  const cachedRef = useRef(value);
  const currentDocKeyRef = useRef(null);
  const cleanupRef = useRef({});
  const searchVisibleRef = useRef(false);
  const readOnlyRef = useRef(readOnly);
  const lastScrollRef = useRef(initialScroll || 0);
  searchVisibleRef.current = searchBarVisible;
  readOnlyRef.current = readOnly;

  const variables = getAllVariables(collection, item);

  const openSearch = useCallback(() => {
    const compat = compatRef.current;
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
    const exts = [];
    if (enableVariableHighlighting) {
      exts.push(brunoVariablesHighlight(variables, { highlightPathParams: false }));
    }
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
        { key: 'Mod-Enter', run: () => true },
        {
          key: 'Tab',
          run: (view) => {
            const compat = createCm5Compat(view);
            const sel = compat.getSelection();
            if (sel.includes('\n') || compat.getLine(compat.getCursor().line) === sel) {
              return indentMore(view);
            }
            compat.replaceSelection('  ');
            return true;
          }
        },
        { key: 'Shift-Tab', run: (view) => indentLess(view) },
        {
          key: 'Mod-Space',
          run: (view) => {
            showRootHints(createCm5Compat(view), showHintsFor);
            return true;
          }
        },
        {
          key: 'Ctrl-Space',
          run: (view) => {
            showRootHints(createCm5Compat(view), showHintsFor);
            return true;
          }
        }
      ])
    );
    return exts;
  }, [variables, enableVariableHighlighting, showHintsFor, openSearch, openReplace]);

  useImperativeHandle(ref, () => ({
    editor: compatRef.current
  }), []);

  const handleViewRef = useCallback((view) => {
    viewRef.current = view;
    if (!view) return;

    compatRef.current = createCm5Compat(view);

    const docKey = docKeyProp || getDocKey({ docKey: docKeyProp, item, collection, mode, readOnly });
    currentDocKeyRef.current = docKey;
    cachedRef.current = view.state.doc.toString();

    applyEditorState6(view, readPersistedEditorState({ scope: persistenceScope, key: docKey }), cachedRef.current);

    cleanupRef.current.autocomplete = setupAutoComplete6(view, {
      showHintsFor,
      getAllVariables: () => getAllVariables(collection, item)
    });
    cleanupRef.current.linkAware = setupLinkAware6(view);
    cleanupRef.current.lintTooltip = setupLintErrorTooltip6(view);
    cleanupRef.current.resize = setupCodeMirrorResizeRefresh(view, view.dom.parentElement);

    if (enableBrunoVarInfo) {
      cleanupRef.current.varInfo = setupBrunoVarInfo6(view, {
        variables,
        collection,
        item
      });
    }

    if (scriptType && aiPreferences) {
      cleanupRef.current.ai = setupAiAutocomplete6(view, {
        scriptType,
        isEnabled: () => Boolean(aiPreferences?.enabled) && aiPreferences?.autocomplete?.enabled !== false,
        getTriggerMode: () => aiPreferences?.autocomplete?.triggerMode || 'debounced',
        getContext: () => buildAutocompleteContext({ item, collection, scriptType })
      });
    }

    if (initialScroll) {
      view.scrollDOM.scrollTop = initialScroll;
    }

    if (onScroll) {
      view.scrollDOM.addEventListener('scroll', () => {
        lastScrollRef.current = view.scrollDOM.scrollTop;
        onScroll(view.scrollDOM.scrollTop);
      });
    }

    if (containScroll) {
      const input = view.contentDOM;
      const nativeFocus = input.focus.bind(input);
      input.focus = (options) => nativeFocus({ ...(options || {}), preventScroll: true });
    }

    const persistDebounced = debounce(() => {
      if (!currentDocKeyRef.current || !viewRef.current) return;
      writePersistedEditorState({
        scope: persistenceScope,
        key: currentDocKeyRef.current,
        state: captureEditorState6(viewRef.current)
      });
    }, 250);

    compatRef.current.on('fold', persistDebounced);
    compatRef.current.on('unfold', persistDebounced);
    cleanupRef.current.persist = () => {
      compatRef.current?.off('fold', persistDebounced);
      compatRef.current?.off('unfold', persistDebounced);
      persistDebounced.cancel?.();
    };
  }, [collection, containScroll, docKeyProp, enableBrunoVarInfo, initialScroll, item, mode, onScroll, persistenceScope, readOnly, scriptType, aiPreferences, showHintsFor, variables]);

  const handleChange = useCallback((newValue) => {
    cachedRef.current = newValue;
    onEdit?.(newValue);
  }, [onEdit]);

  useEffect(() => {
    onSearchBarVisibilityChange?.(searchBarVisible);
  }, [searchBarVisible, onSearchBarVisibilityChange]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const newDocKey = docKeyProp || getDocKey({ docKey: docKeyProp, item, collection, mode, readOnly });
    const docKeyChanged = newDocKey !== currentDocKeyRef.current;

    if (docKeyChanged) {
      if (currentDocKeyRef.current) {
        writePersistedEditorState({
          scope: persistenceScope,
          key: currentDocKeyRef.current,
          state: captureEditorState6(view)
        });
      }
      currentDocKeyRef.current = newDocKey;
      cachedRef.current = String(value ?? '');
      applyEditorState6(view, readPersistedEditorState({ scope: persistenceScope, key: newDocKey }), cachedRef.current);
    } else if (value !== cachedRef.current) {
      const compat = compatRef.current;
      if (compat) {
        const cursor = compat.getCursor();
        compat.setValue(String(value ?? ''));
        compat.setCursor(cursor);
        writePersistedEditorState({ scope: persistenceScope, key: currentDocKeyRef.current, state: null });
      }
      cachedRef.current = String(value ?? '');
    }
  }, [value, mode, readOnly, docKeyProp, item, collection, persistenceScope]);

  useEffect(() => {
    return () => {
      if (onScroll) {
        onScroll(lastScrollRef.current);
      }
      if (currentDocKeyRef.current && viewRef.current) {
        writePersistedEditorState({
          scope: persistenceScope,
          key: currentDocKeyRef.current,
          state: captureEditorState6(viewRef.current)
        });
      }
      cleanupRef.current.autocomplete?.();
      cleanupRef.current.linkAware?.();
      cleanupRef.current.lintTooltip?.();
      cleanupRef.current.resize?.();
      cleanupRef.current.varInfo?.();
      cleanupRef.current.ai?.();
      cleanupRef.current.persist?.();
      if (searchBarVisible) {
        onSearchBarVisibilityChange?.(false);
      }
    };
  }, [onScroll, onSearchBarVisibilityChange, persistenceScope, searchBarVisible]);

  return (
    <StyledWrapper
      className={`h-full w-full flex flex-col relative graphiql-container ${readOnly ? 'read-only' : ''} ${searchBarVisible ? 'search-bar-visible' : ''}`}
      aria-label="Code Editor"
      data-testid={testId}
      font={font}
      fontSize={fontSize}
    >
      <CodeMirrorSearch6
        ref={searchBarRef}
        visible={searchBarVisible}
        view={viewRef.current}
        readOnly={readOnly}
        onClose={() => setSearchBarVisible(false)}
      />
      <div className="editor-container" style={{ height: '100%', width: '100%' }}>
        <BrunoCodeEditor
          ref={handleViewRef}
          value={value}
          mode={mode}
          theme={theme}
          readOnly={readOnly}
          onChange={handleChange}
          preset={PRESETS.FULL}
          font={font}
          fontSize={fontSize}
          enableLint={Boolean(value?.trim())}
          extraExtensions={extraExtensions}
          style={{ height: '100%' }}
        />
      </div>
    </StyledWrapper>
  );
});

const CodeEditorWithPersistenceScope = forwardRef((props, ref) => {
  const persistenceScope = usePersistenceScope();
  const aiPreferences = useSelector((state) => state.app.preferences?.ai);
  return (
    <CodeEditor
      {...props}
      persistenceScope={persistenceScope}
      aiPreferences={aiPreferences}
      ref={ref}
    />
  );
});

CodeEditorWithPersistenceScope.displayName = 'CodeEditor';

export default CodeEditorWithPersistenceScope;
