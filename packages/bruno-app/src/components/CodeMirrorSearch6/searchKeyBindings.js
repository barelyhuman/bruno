import { keymap } from '@codemirror/view';
import { createCm5Compat } from 'utils/codemirror6/compat';

/**
 * CM6 search keybindings using compat shim for CodeMirrorSearch6.
 */
export function buildSearchKeyBindings6({ setState, searchBarRef, isSearchBarVisible, isReadOnly, viewRef }) {
  const openSearch = () => {
    const view = viewRef?.current;
    if (!view) return;
    const compat = createCm5Compat(view);
    const selected = compat.getSelection();
    const cursor = compat.getCursor('from');
    setState({ searchBarVisible: true }, () => {
      if (selected) {
        searchBarRef.current?.setSearch(selected, cursor);
      } else {
        searchBarRef.current?.focusAtCursor(cursor);
      }
    });
  };

  const openReplace = () => {
    if (isReadOnly()) return;
    setState({ searchBarVisible: true }, () => {
      searchBarRef.current?.focus();
      searchBarRef.current?.openReplace();
    });
  };

  return keymap.of([
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
        if (isSearchBarVisible()) {
          searchBarRef.current?.close();
          return true;
        }
        return false;
      }
    }
  ]);
}
