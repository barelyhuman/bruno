import { useMemo } from 'react';
import { getLanguageSupport } from 'utils/codemirror6/languages';
import { brunoThemeExtension } from 'utils/codemirror6/theme';
import { brunoJavaScriptLinter } from 'utils/codemirror6/extensions/brunoLint';
import { brunoJsonLinter } from 'utils/codemirror6/extensions/jsonLint';
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
const JSON_MODES = new Set(['application/json', 'application/ld+json', 'json']);

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
  extraExtensions = []
}) {
  return useMemo(() => {
    const isDark = theme === 'dark';
    const cmTheme = styledTheme?.codemirror;
    const isInline = preset === PRESETS.INLINE_SINGLE || preset === PRESETS.INLINE_MULTI;
    const hasNativeSearch = preset === PRESETS.APISPEC || preset === PRESETS.GRAPHQL;

    const extensions = [
      ...baseSetup({
        lineNumbers: !isInline,
        lintGutter: preset === PRESETS.APISPEC || preset === PRESETS.FILE || preset === PRESETS.FULL,
        enableSearch: hasNativeSearch
      }),
      lineWrappingExtension(),
      tabKeymapExtension(),
      ...getLanguageSupport(mode),
      ...brunoThemeExtension(cmTheme, { isDark, font, fontSize }),
      ...readOnlyExtension(readOnly),
      mousetrapExtension(),
      ...extraExtensions
    ];

    if (hasNativeSearch) {
      extensions.push(searchKeymapExtension());
    }

    if (enableLint) {
      if (preset === PRESETS.APISPEC || preset === PRESETS.FILE || preset === PRESETS.FULL) {
        if (JSON_MODES.has(mode)) {
          extensions.push(brunoJsonLinter());
        } else {
          extensions.push(brunoJavaScriptLinter(LINT_OPTIONS));
        }
      }
    }

    return extensions;
  }, [preset, mode, theme, styledTheme, readOnly, font, fontSize, enableLint, extraExtensions]);
}
