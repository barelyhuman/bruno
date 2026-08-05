import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { IconEye, IconEyeOff } from '@tabler/icons';
import { keymap } from '@codemirror/view';
import { getAllVariables } from 'utils/collections';
import { PRESETS } from 'components/BrunoCodeEditor/presets';
import { useBrunoExtensions } from 'components/BrunoCodeEditor/useBrunoExtensions';
import { useBrunoCodeMirror } from 'components/BrunoCodeEditor/useBrunoCodeMirror';
import { brunoVariablesHighlight } from 'utils/codemirror6/extensions/brunoVariablesHighlight';
import { setupAutoComplete6 } from 'utils/codemirror6/extensions/autocomplete';
import { setupLinkAware6 } from 'utils/codemirror6/extensions/linkAware';
import { setupBrunoVarInfo6 } from 'utils/codemirror6/extensions/brunoVarInfo';
import { createMaskedEditor6 } from 'utils/codemirror6/extensions/maskedEditor';
import StyledWrapper from './StyledWrapper';

const SERVER_RENDERED = typeof window === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

export default function MultiLineEditor({
  value = '',
  theme,
  placeholder,
  readOnly = false,
  onChange,
  collection,
  item,
  isSecret = false,
  hideSecretEye = false,
  onMaskChange,
  autocomplete = [],
  enableBrunoVarInfo = true,
  className = '',
  testId,
  name
}) {
  const styledTheme = useTheme();
  const cachedRef = useRef(value);
  const maskedRef = useRef(null);
  const cleanupRef = useRef({});
  const editorViewRef = useRef(null);
  const [maskInput, setMaskInput] = useState(isSecret);

  const variables = getAllVariables(collection, item);

  const inlineKeys = useMemo(() => keymap.of([
    { key: 'Mod-f', run: () => true },
    { key: 'Tab', run: () => true },
    { key: 'Shift-Tab', run: () => true },
    { key: 'Mod-Enter', run: () => true }
  ]), []);

  const extraExtensions = useMemo(() => [
    brunoVariablesHighlight(variables, { highlightPathParams: false }),
    inlineKeys
  ], [variables, inlineKeys]);

  const extensions = useBrunoExtensions({
    preset: PRESETS.INLINE_MULTI,
    mode: 'text/plain',
    theme,
    styledTheme,
    readOnly,
    enableLint: false,
    extraExtensions
  });

  const handleChange = useCallback((newValue) => {
    cachedRef.current = newValue;
    onChange?.(newValue);
    requestAnimationFrame(() => editorViewRef.current?.requestMeasure());
  }, [onChange]);

  const { setContainer } = useBrunoCodeMirror({
    value,
    extensions,
    onChange: handleChange,
    onCreateEditor: (view) => {
      editorViewRef.current = view;
      cleanupRef.current.autocomplete = setupAutoComplete6(view, {
        showHintsFor: ['variables'],
        getAllVariables: () => getAllVariables(collection, item),
        getAnywordAutocompleteHints: () => autocomplete || []
      });
      cleanupRef.current.linkAware = setupLinkAware6(view);
      if (enableBrunoVarInfo) {
        cleanupRef.current.varInfo = setupBrunoVarInfo6(view, {
          variables,
          collection,
          item
        });
      }
      if (isSecret) {
        maskedRef.current = createMaskedEditor6(view);
        maskedRef.current.enable();
      }
    },
    readOnly
  });

  useEffect(() => {
    if (isSecret) {
      if (!maskedRef.current && editorViewRef.current) {
        maskedRef.current = createMaskedEditor6(editorViewRef.current);
      }
      maskedRef.current?.enable();
      setMaskInput(true);
      onMaskChange?.(true);
    } else {
      maskedRef.current?.disable();
      maskedRef.current?.destroy();
      maskedRef.current = null;
      setMaskInput(false);
      onMaskChange?.(false);
    }
  }, [isSecret, onMaskChange]);

  useEffect(() => {
    return () => {
      cleanupRef.current.autocomplete?.();
      cleanupRef.current.linkAware?.();
      cleanupRef.current.varInfo?.();
      maskedRef.current?.destroy();
    };
  }, []);

  const toggleVisibleSecret = () => {
    const next = !maskInput;
    setMaskInput(next);
    if (next) {
      if (!maskedRef.current && editorViewRef.current) {
        maskedRef.current = createMaskedEditor6(editorViewRef.current);
      }
      maskedRef.current?.enable();
    } else {
      maskedRef.current?.disable();
    }
    onMaskChange?.(next);
  };

  if (SERVER_RENDERED) {
    return <div className={`flex flex-row justify-between w-full overflow-x-auto ${className}`} />;
  }

  const wrapperTestId = testId ?? (name ? `test-multiline-editor-${name}` : undefined);

  return (
    <div data-testid={wrapperTestId} className={`flex flex-row justify-between w-full overflow-x-auto ${className}`}>
      <StyledWrapper
        ref={setContainer}
        className={`multi-line-editor grow bruno-cm6-editor ${readOnly ? 'read-only' : ''}`}
        placeholder={placeholder}
      />
      {!hideSecretEye && isSecret && (
        <button type="button" className="mx-2" data-testid="secret-reveal-toggle" onClick={toggleVisibleSecret}>
          {maskInput ? <IconEyeOff size={18} strokeWidth={2} /> : <IconEye size={18} strokeWidth={2} />}
        </button>
      )}
    </div>
  );
}
