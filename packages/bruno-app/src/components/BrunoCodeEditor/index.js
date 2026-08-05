import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { attachE2EShim, detachE2EShim } from 'utils/codemirror6/e2eShim';
import { useBrunoExtensions, NO_EXTRA_EXTENSIONS } from './useBrunoExtensions';
import { PRESETS } from './presets';

/**
 * Base CM6 code editor used by all migrated Bruno editor wrappers.
 */
const BrunoCodeEditor = React.forwardRef(function BrunoCodeEditor(
  {
    value = '',
    mode,
    theme,
    readOnly = false,
    onChange,
    preset = PRESETS.FULL,
    font,
    fontSize,
    enableLint = true,
    className = '',
    style,
    extraExtensions = NO_EXTRA_EXTENSIONS
  },
  ref
) {
  const styledTheme = useTheme();
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const extensionsCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const ignoreChangeRef = useRef(false);
  onChangeRef.current = onChange;

  const extensions = useBrunoExtensions({
    preset,
    mode,
    theme,
    styledTheme,
    readOnly,
    font,
    fontSize,
    enableLint,
    extraExtensions
  });

  const handleChange = useCallback((newValue) => {
    if (!ignoreChangeRef.current) {
      onChangeRef.current?.(newValue);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        handleChange(update.state.doc.toString());
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

    const view = new EditorView({ state, parent: containerRef.current });
    attachE2EShim(view);
    viewRef.current = view;

    if (typeof ref === 'function') {
      ref(view);
    } else if (ref) {
      ref.current = view;
    }

    return () => {
      detachE2EShim(view);
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: extensionsCompartment.current.reconfigure(extensions)
    });
  }, [extensions]);

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

  return (
    <div
      ref={containerRef}
      className={`bruno-cm6-editor ${className}`.trim()}
      style={{ height: '100%', width: '100%', ...style }}
    />
  );
});

export default BrunoCodeEditor;
export { PRESETS };
