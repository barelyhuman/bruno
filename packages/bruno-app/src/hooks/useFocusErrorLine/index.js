import { useEffect, useRef } from 'react';
import find from 'lodash/find';
import { useDispatch, useSelector } from 'react-redux';
import { clearFocusErrorLine } from 'providers/ReduxStore/slices/tabs';
import { focusErrorLine } from 'utils/codemirror6/extensions/focusErrorLine';

/**
 * Subscribes a CodeMirror-hosting component to the tab's `focusErrorLine` signal.
 */
export const useFocusErrorLine = ({ uid, editorRef, scriptPhase, isVisible = true }) => {
  const dispatch = useDispatch();
  const focusErrorLineState = useSelector((state) => {
    const tab = find(state.tabs.tabs, (t) => t.uid === uid);
    return tab?.focusErrorLine || null;
  });

  const disposeRef = useRef(null);

  useEffect(() => {
    if (!focusErrorLineState || !isVisible) return;
    if (focusErrorLineState.scriptPhase !== scriptPhase) return;

    const timer = setTimeout(() => {
      const compat = editorRef.current?.editor;
      if (!compat) return;

      if (disposeRef.current) {
        disposeRef.current();
        disposeRef.current = null;
      }

      disposeRef.current = focusErrorLine(compat, focusErrorLineState.line);
      dispatch(clearFocusErrorLine({ uid }));
    }, 0);

    return () => clearTimeout(timer);
  }, [focusErrorLineState?.requestedAt, focusErrorLineState?.line, focusErrorLineState?.scriptPhase, isVisible, scriptPhase, uid, dispatch, editorRef]);

  useEffect(() => {
    return () => {
      if (disposeRef.current) {
        disposeRef.current();
        disposeRef.current = null;
      }
    };
  }, []);
};

export default useFocusErrorLine;
