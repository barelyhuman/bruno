/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 * ApiSpec YAML/JSON file editor — migrated to CodeMirror 6.
 */

import React, { useCallback } from 'react';
import BrunoCodeEditor, { PRESETS } from 'components/BrunoCodeEditor';
import StyledWrapper from './StyledWrapper';

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
