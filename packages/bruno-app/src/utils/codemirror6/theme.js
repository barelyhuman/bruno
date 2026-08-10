import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

/**
 * Build CM6 theme extensions from Bruno styled-components theme.codemirror tokens.
 */
export function brunoThemeExtension(cmTheme, { isDark = false, font, fontSize } = {}) {
  if (!cmTheme) return [];

  const tokens = cmTheme.tokens || {};

  const editorTheme = EditorView.theme({
    '&': {
      backgroundColor: cmTheme.bg,
      color: tokens.variable || 'inherit',
      fontSize: fontSize || undefined,
      fontFamily: font && font !== 'default' ? font : undefined
    },
    '.cm-content': {
      caretColor: tokens.variable || 'inherit',
      lineBreak: 'anywhere'
    },
    '.cm-gutters': {
      backgroundColor: cmTheme.gutter?.bg || cmTheme.bg,
      borderRight: `1px solid ${cmTheme.border}`,
      color: tokens.comment || '#888'
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent'
    },
    '.cm-activeLine': {
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
    },
    '.cm-placeholder': {
      color: cmTheme.placeholder?.color || '#888',
      opacity: cmTheme.placeholder?.opacity ?? 0.5
    },
    '.cm-cursor': {
      borderLeftColor: tokens.variable || 'inherit'
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: isDark ? 'rgba(100,100,255,0.3)' : 'rgba(0,100,255,0.2)'
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(0,200,0,0.2)',
      outline: 'none'
    },
    '.cm-nonmatchingBracket': {
      backgroundColor: 'rgba(255,0,0,0.2)'
    },
    '.cm-variable-valid': {
      color: cmTheme.variable?.valid
    },
    '.cm-variable-invalid': {
      color: cmTheme.variable?.invalid
    },
    '.cm-variable-prompt': {
      color: cmTheme.variable?.prompt
    },
    '.cm-search-match': {
      backgroundColor: cmTheme.searchMatch || '#FFD700'
    },
    '.cm-search-match-current': {
      backgroundColor: cmTheme.searchMatchActive || '#FF9632'
    },
    '.cm-search-line-highlight': {
      backgroundColor: cmTheme.searchLineHighlightCurrent || 'rgba(120,120,120,0.18)'
    },
    '.cm-foldPlaceholder': {
      backgroundColor: isDark ? '#444' : '#eee',
      border: 'none',
      color: tokens.comment || '#888'
    },
    '&.cm-focused': {
      outline: 'none'
    }
  }, { dark: isDark });

  const highlightStyle = HighlightStyle.define([
    { tag: tags.definition(tags.propertyName), color: tokens.definition },
    { tag: tags.propertyName, color: tokens.property },
    { tag: tags.string, color: tokens.string },
    { tag: tags.number, color: tokens.number },
    { tag: tags.bool, color: tokens.atom },
    { tag: tags.atom, color: tokens.atom },
    { tag: tags.variableName, color: tokens.variable },
    { tag: tags.keyword, color: tokens.keyword },
    { tag: tags.comment, color: tokens.comment },
    { tag: tags.lineComment, color: tokens.comment },
    { tag: tags.operator, color: tokens.operator },
    { tag: tags.tagName, color: tokens.tag },
    { tag: tags.angleBracket, color: tokens.tagBracket },
    { tag: tags.meta, color: tokens.keyword }
  ]);

  return [
    editorTheme,
    syntaxHighlighting(highlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true })
  ];
}
