/**
 * ApiSpec YAML/JSON file editor — migrated to CodeMirror 6.
 */

import React, { useCallback } from 'react';
import BrunoCodeEditor, { PRESETS } from 'components/BrunoCodeEditor';
import StyledWrapper from './StyledWrapper';

const SERVER_RENDERED = typeof window === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

export default function CodeEditor({
  value = '',
  mode = 'yaml',
  theme,
  readOnly = false,
  onEdit,
  font
}) {
  const handleChange = useCallback((newValue) => {
    onEdit?.(newValue);
  }, [onEdit]);

  if (SERVER_RENDERED) {
    return (
      <StyledWrapper
        className="h-full w-full graphiql-container"
        aria-label="Code Editor"
        font={font}
      />
    );
  }

  return (
    <StyledWrapper
      className="h-full w-full graphiql-container"
      aria-label="Code Editor"
      font={font}
      $isDark={theme === 'dark'}
    >
      <BrunoCodeEditor
        value={value}
        mode={mode}
        theme={theme}
        readOnly={readOnly}
        onChange={handleChange}
        preset={PRESETS.APISPEC}
        font={font}
        enableLint={Boolean(value?.trim())}
      />
    </StyledWrapper>
  );
}
