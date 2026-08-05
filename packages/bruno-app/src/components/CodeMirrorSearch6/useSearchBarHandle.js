import { useImperativeHandle } from 'react';
import { findSearchMatches, createCacheKey } from './searchUtils';

/**
 * Imperative API for <CodeMirrorSearch6 /> (CM6 EditorView).
 */
export function useSearchBarHandle({
  ref,
  view,
  searchText,
  regex,
  caseSensitive,
  wholeWord,
  searchMatches,
  searchCacheKey,
  docVersion,
  initialIndexRef,
  inputRef,
  replaceInputRef,
  setSearchText,
  setMatchCount,
  setMatchIndex,
  setReplaceVisible,
  doSearch,
  handleSearchBarClose
}) {
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },

    setSearch: (text, cursorPos) => {
      setSearchText(text);
      if (cursorPos && view && text) {
        const matches = findSearchMatches(view, text, regex, caseSensitive, wholeWord);
        const startsAtOrAfterCursor = (match) =>
          match.from.line > cursorPos.line
          || (match.from.line === cursorPos.line && match.from.ch >= cursorPos.ch);

        const matchAtCursorIdx = matches.findIndex(startsAtOrAfterCursor);
        const targetIdx = matchAtCursorIdx >= 0 ? matchAtCursorIdx : 0;
        searchMatches.current = matches;
        searchCacheKey.current = createCacheKey(docVersion.current, text, regex, caseSensitive, wholeWord);
        setMatchCount(matches.length);
        setMatchIndex(targetIdx);
        doSearch(text, targetIdx, null, true);
        initialIndexRef.current = { idx: targetIdx, forText: text };
      } else {
        setMatchIndex(0);
      }
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    },

    focusAtCursor: (cursorPos) => {
      if (cursorPos && view && searchText) {
        const expectedKey = createCacheKey(docVersion.current, searchText, regex, caseSensitive, wholeWord);
        const matches = (expectedKey === searchCacheKey.current && searchMatches.current.length)
          ? searchMatches.current
          : findSearchMatches(view, searchText, regex, caseSensitive, wholeWord);
        const startsAtOrAfterCursor = (match) =>
          match.from.line > cursorPos.line
          || (match.from.line === cursorPos.line && match.from.ch >= cursorPos.ch);
        const targetIdx = matches.findIndex(startsAtOrAfterCursor);
        const resolvedIdx = targetIdx >= 0 ? targetIdx : 0;
        searchMatches.current = matches;
        searchCacheKey.current = expectedKey;
        setMatchCount(matches.length);
        setMatchIndex(resolvedIdx);
        initialIndexRef.current = { idx: resolvedIdx, forText: searchText };
        doSearch(searchText, resolvedIdx);
      }
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    },

    openReplace: () => {
      setReplaceVisible(true);
      setTimeout(() => {
        replaceInputRef.current?.focus();
        replaceInputRef.current?.select();
      }, 0);
    },

    close: () => {
      handleSearchBarClose();
    }
  }));
}
