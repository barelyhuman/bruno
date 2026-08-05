import React, { useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from 'styled-components';
import { IconEye, IconEyeOff } from '@tabler/icons';
import { keymap, EditorView } from '@codemirror/view';
import { getAllVariables } from 'utils/collections';
import { PRESETS } from 'components/BrunoCodeEditor/presets';
import { useBrunoExtensions } from 'components/BrunoCodeEditor/useBrunoExtensions';
import { useBrunoCodeMirror } from 'components/BrunoCodeEditor/useBrunoCodeMirror';
import { brunoVariablesHighlight } from 'utils/codemirror6/extensions/brunoVariablesHighlight';
import { setupAutoComplete6 } from 'utils/codemirror6/extensions/autocomplete';
import { setupLinkAware6 } from 'utils/codemirror6/extensions/linkAware';
import { setupBrunoVarInfo6 } from 'utils/codemirror6/extensions/brunoVarInfo';
import { createMaskedEditor6 } from 'utils/codemirror6/extensions/maskedEditor';
import { createCm5Compat } from 'utils/codemirror6/compat';
import StyledWrapper from './StyledWrapper';

const SERVER_RENDERED = typeof window === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

const SingleLineEditor = forwardRef(function SingleLineEditor(
  {
    value = '',
    theme,
    placeholder,
    readOnly = false,
    onChange,
    onRun,
    onPaste,
    collection,
    item,
    isSecret = false,
    highlightPathParams = false,
    enableBrunoVarInfo = true,
    showHintsFor = ['variables'],
    showHintsOnClick,
    autocomplete = [],
    allowNewlines = false,
    showNewlineArrow = false,
    className = '',
    isCompact = false,
    'data-testid': dataTestId
  },
  ref
) {
  const styledTheme = useTheme();
  const cachedRef = useRef(value);
  const maskedRef = useRef(null);
  const cleanupRef = useRef({});
  const compatRef = useRef(null);
  const [maskInput, setMaskInput] = useState(isSecret);

  const variables = getAllVariables(collection, item);

  const inlineKeys = useMemo(() => keymap.of([
    { key: 'Mod-f', run: () => true },
    { key: 'Tab', run: () => true },
    { key: 'Shift-Tab', run: () => true },
    {
      key: 'Enter',
      run: () => {
        onRun?.();
        return true;
      }
    },
    {
      key: 'Alt-Enter',
      run: (view) => {
        if (allowNewlines) {
          const compat = createCm5Compat(view);
          compat.setValue(compat.getValue() + '\n');
          compat.setCursor(compat.lineCount(), 0);
        } else if (onRun) {
          onRun();
        }
        return true;
      }
    },
    { key: 'Mod-Enter', run: () => {
      onRun?.(); return true;
    } }
  ]), [onRun, allowNewlines]);

  const extraExtensions = useMemo(() => {
    const exts = [
      brunoVariablesHighlight(variables, { highlightPathParams }),
      inlineKeys
    ];
    if (placeholder) {
      exts.push(EditorView.contentAttributes.of({ 'data-placeholder': placeholder }));
    }
    return exts;
  }, [variables, highlightPathParams, inlineKeys, placeholder]);

  const extensions = useBrunoExtensions({
    preset: PRESETS.INLINE_SINGLE,
    mode: 'text/plain',
    theme,
    styledTheme,
    readOnly,
    enableLint: false,
    extraExtensions
  });

  useImperativeHandle(ref, () => ({
    editor: compatRef.current
  }), []);

  const handleChange = useCallback((newValue) => {
    cachedRef.current = newValue;
    if (onChange && value !== newValue) {
      onChange(newValue);
    }
    if (showNewlineArrow && compatRef.current) {
      updateNewlineMarkers(compatRef.current);
    }
  }, [onChange, value, showNewlineArrow]);

  const { viewRef, setContainer } = useBrunoCodeMirror({
    value,
    extensions,
    onChange: handleChange,
    onCreateEditor: (view) => {
      compatRef.current = createCm5Compat(view);
      cleanupRef.current.autocomplete = setupAutoComplete6(view, {
        getAllVariables: () => getAllVariables(collection, item),
        getAnywordAutocompleteHints: () => autocomplete || [],
        showHintsFor,
        showHintsOnClick
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
      if (showNewlineArrow) {
        updateNewlineMarkers(compatRef.current);
      }
      if (onPaste) {
        compatRef.current.on('paste', (_, e) => onPaste(e));
      }
    },
    readOnly
  });

  useEffect(() => {
    if (isSecret) {
      if (!maskedRef.current && viewRef.current) {
        maskedRef.current = createMaskedEditor6(viewRef.current);
      }
      maskedRef.current?.enable();
      setMaskInput(true);
    } else {
      maskedRef.current?.disable();
      maskedRef.current?.destroy();
      maskedRef.current = null;
      setMaskInput(false);
    }
  }, [isSecret]);

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
      if (!maskedRef.current && viewRef.current) {
        maskedRef.current = createMaskedEditor6(viewRef.current);
      }
      maskedRef.current?.enable();
    } else {
      maskedRef.current?.disable();
    }
  };

  if (SERVER_RENDERED) {
    return <div className={`flex flex-row items-center w-full overflow-x-auto ${className}`} />;
  }

  return (
    <div className={`flex flex-row items-center w-full overflow-x-auto ${className}`}>
      <StyledWrapper
        ref={setContainer}
        className={`single-line-editor grow bruno-cm6-editor ${readOnly ? 'read-only' : ''}`}
        $isCompact={isCompact}
        {...(dataTestId ? { 'data-testid': dataTestId } : {})}
      />
      <div className="flex items-center">
        {isSecret && (
          <button type="button" className="mx-2" data-testid="secret-reveal-toggle" onClick={toggleVisibleSecret}>
            {maskInput ? <IconEyeOff size={18} strokeWidth={2} /> : <IconEye size={18} strokeWidth={2} />}
          </button>
        )}
      </div>
    </div>
  );
});

function updateNewlineMarkers(compat) {
  if (!compat?.markText) return;
  compat._newlineMarkers?.forEach((m) => m.clear?.());
  const markers = [];
  const content = compat.getValue();
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      const pos = compat.posFromIndex(i);
      const nextPos = compat.posFromIndex(i + 1);
      const arrow = document.createElement('span');
      arrow.className = 'newline-arrow';
      arrow.textContent = '↲';
      arrow.style.cssText = 'color:#888;font-size:8px;margin:0 2px;vertical-align:middle;display:inline-block;';
      markers.push(compat.markText(pos, nextPos, { replacedWith: arrow, handleMouseEvents: true }));
    }
  }
  compat._newlineMarkers = markers;
}

export default SingleLineEditor;
