import { useEffect, useRef, useCallback } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { attachE2eShim, detachE2eShim } from 'utils/codemirror6/e2eShim';
import { createCm5Compat } from 'utils/codemirror6/compat';

/**
 * Custom React hook wrapping CM6 EditorView (replaces CM5 imperative constructor).
 */
export function useBrunoCodeMirror({
  container,
  value = '',
  extensions = [],
  onChange,
  onCreateEditor,
  readOnly
}) {
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const extensionsCompartment = useRef(new Compartment());
  const ignoreChangeRef = useRef(false);
  onChangeRef.current = onChange;

  const setContainer = useCallback((node) => {
    if (viewRef.current) {
      detachE2eShim(viewRef.current);
      viewRef.current.destroy();
      viewRef.current = null;
    }

    if (!node) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !ignoreChangeRef.current) {
        onChangeRef.current?.(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value || '',
      extensions: [
        extensionsCompartment.current.of(extensions),
        updateListener,
        EditorView.contentAttributes.of({ 'data-testid': 'cm6-editor' })
      ]
    });

    const view = new EditorView({ state, parent: node });
    attachE2eShim(view);
    createCm5Compat(view);
    viewRef.current = view;
    onCreateEditor?.(view);
  }, []);

  // Reconfigure extensions when they change
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: extensionsCompartment.current.reconfigure(extensions)
    });
  }, [extensions]);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (value === current) return;

    ignoreChangeRef.current = true;
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value ?? '' }
    });
    ignoreChangeRef.current = false;
  }, [value]);

  return { viewRef, setContainer };
}

export default useBrunoCodeMirror;
