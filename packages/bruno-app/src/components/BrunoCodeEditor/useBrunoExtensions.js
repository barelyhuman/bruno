import { useMemo } from 'react';
import { getLanguageSupport, isJsonMode, isYamlMode } from 'utils/codemirror6/languages';
import { brunoThemeExtension } from 'utils/codemirror6/theme';
import { apispecThemeExtension } from 'utils/codemirror6/theme/apispec';
import { brunoJavaScriptLinter } from 'utils/codemirror6/extensions/brunoLint';
import { brunoJsonLinter } from 'utils/codemirror6/extensions/jsonLint';
import { brunoYamlLinter } from 'utils/codemirror6/extensions/yamlLint';
import {
  baseSetup,
  lineWrappingExtension,
  tabKeymapExtension,
  searchKeymapExtension,
  readOnlyExtension,
  mousetrapExtension
} from 'utils/codemirror6/extensions/baseSetup';
import { PRESETS } from './presets';

const LINT_OPTIONS = { esversion: 11, expr: true, asi: true };
export const NO_EXTRA_EXTENSIONS = [];

/**
 * Compose CM6 extensions for a Bruno editor preset.
 */
export function useBrunoExtensions({
  preset,
  mode,
  theme,
  styledTheme,
  readOnly,
  font,
  fontSize,
  enableLint = true,
  extraExtensions = NO_EXTRA_EXTENSIONS
}) {
  const cmTheme = styledTheme?.codemirror;
  const themeStatus = styledTheme?.status;
  const themeColors = styledTheme?.colors;

  return useMemo(() => {
    const isDark = theme === 'dark';
    const isInline = preset === PRESETS.INLINE_SINGLE || preset === PRESETS.INLINE_MULTI;
    const hasNativeSearch = preset === PRESETS.APISPEC || preset === PRESETS.GRAPHQL;
    const languageMode = preset === PRESETS.APISPEC ? 'yaml' : mode;

    const themeExtension = preset === PRESETS.APISPEC
      ? apispecThemeExtension(cmTheme, {
          isDark,
          font,
          fontSize,
          status: themeStatus,
          colors: themeColors
        })
      : brunoThemeExtension(cmTheme, { isDark, font, fontSize });

    const isFileYaml = preset === PRESETS.FILE && isYamlMode(languageMode);
    const showLintGutter
      = preset === PRESETS.APISPEC
        || isFileYaml
        || preset === PRESETS.FULL;

    const extensions = [
      ...baseSetup({
        lineNumbers: !isInline,
        lintGutter: showLintGutter,
        enableSearch: hasNativeSearch,
        tabSize: isInline ? undefined : 2
      }),
      lineWrappingExtension(),
      tabKeymapExtension(),
      ...getLanguageSupport(languageMode),
      ...themeExtension,
      ...readOnlyExtension(readOnly),
      mousetrapExtension(),
      ...extraExtensions
    ];

    if (hasNativeSearch) {
      extensions.push(searchKeymapExtension());
    }

    if (enableLint) {
      if (preset === PRESETS.APISPEC || isFileYaml) {
        extensions.push(brunoYamlLinter());
      } else if (preset === PRESETS.FULL) {
        if (isYamlMode(languageMode)) {
          extensions.push(brunoYamlLinter());
        } else if (isJsonMode(languageMode)) {
          extensions.push(brunoJsonLinter());
        } else {
          extensions.push(brunoJavaScriptLinter(LINT_OPTIONS));
        }
      }
      // PRESETS.FILE plain text: no language linter
    }

    return extensions;
  }, [preset, mode, theme, cmTheme, themeStatus, themeColors, readOnly, font, fontSize, enableLint, extraExtensions]);
}
