import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

/** CM5 ApiSpec dark palette (monokai + VS Code overrides from old StyledWrapper). */
const DARK = {
  bg: '#272822',
  gutter: '#272822',
  text: '#f8f8f2',
  lineNumber: '#d0d0d0',
  cursor: '#f8f8f0',
  activeLine: '#373831',
  selection: '#49483E',
  key: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  keyword: '#f92672',
  comment: '#75715e',
  def: '#fd971f',
  meta: '#f8f8f2',
  label: '#9effff',
  type: '#66d9ef',
  content: '#e6db74',
  attributeValue: '#f8f8f2'
};

/** CM5 default-like light palette — high-contrast keys/strings so YAML is readable. */
const LIGHT = {
  bg: '#ffffff',
  gutter: '#f7f7f7',
  gutterBorder: '#ddd',
  text: '#000000',
  lineNumber: '#999999',
  cursor: '#000000',
  activeLine: 'rgba(0, 0, 0, 0.03)',
  selection: '#d7d4f0',
  key: '#0451a5',
  string: '#a31515',
  number: '#098658',
  keyword: '#0000ff',
  comment: '#008000',
  def: '#795e26',
  meta: '#000000',
  label: '#001080',
  type: '#267f99',
  content: '#000000',
  attributeValue: '#000000'
};

/**
 * ApiSpec / API Designer theme — matches CM5 monokai (dark) and default (light).
 */
export function apispecThemeExtension(
  cmTheme,
  { isDark = false, font, fontSize, status, colors } = {}
) {
  const p = isDark ? DARK : LIGHT;
  const matchBracketBg = status?.success?.background || (isDark ? 'rgba(0,200,0,0.2)' : '#e0ffe0');
  const mismatchColor = colors?.text?.danger || '#f92672';
  const mismatchBg = status?.danger?.background || (isDark ? 'rgba(255,0,0,0.2)' : '#ffe0e0');

  const editorTheme = EditorView.theme({
    '&': {
      backgroundColor: isDark ? p.bg : (cmTheme?.bg || p.bg),
      color: p.text,
      fontSize: fontSize || undefined,
      fontFamily: font && font !== 'default' ? font : undefined
    },
    '.cm-content': {
      caretColor: p.cursor,
      lineBreak: 'anywhere'
    },
    '.cm-gutters': {
      backgroundColor: isDark ? p.gutter : (cmTheme?.gutter?.bg || p.gutter),
      borderRight: 'none',
      color: p.lineNumber
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent'
    },
    '.cm-activeLine': {
      backgroundColor: p.activeLine
    },
    '.cm-placeholder': {
      color: cmTheme?.placeholder?.color || '#888',
      opacity: cmTheme?.placeholder?.opacity ?? 0.5
    },
    '.cm-cursor': {
      borderLeftColor: p.cursor
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: p.selection
    },
    '.cm-matchingBracket': {
      backgroundColor: matchBracketBg,
      outline: 'none',
      textDecoration: 'unset'
    },
    '.cm-nonmatchingBracket': {
      color: mismatchColor,
      backgroundColor: mismatchBg,
      outline: 'none',
      textDecoration: 'unset'
    },
    '.cm-search-match': {
      backgroundColor: cmTheme?.searchMatch || '#FFD700'
    },
    '.cm-search-match-current': {
      backgroundColor: cmTheme?.searchMatchActive || '#FF9632'
    },
    '.cm-search-line-highlight': {
      backgroundColor: cmTheme?.searchLineHighlightCurrent || 'rgba(120,120,120,0.18)'
    },
    '.cm-foldPlaceholder': {
      backgroundColor: isDark ? '#444' : '#eee',
      border: 'none',
      color: p.comment
    },
    '&.cm-focused': {
      outline: 'none'
    }
  }, { dark: isDark });

  const highlightStyle = HighlightStyle.define([
    { tag: tags.definition(tags.propertyName), color: p.key },
    { tag: tags.propertyName, color: p.key },
    { tag: tags.string, color: p.string },
    { tag: tags.special(tags.string), color: p.string },
    { tag: tags.number, color: p.number },
    { tag: tags.bool, color: p.keyword },
    { tag: tags.keyword, color: p.keyword },
    { tag: tags.lineComment, color: p.comment },
    { tag: tags.comment, color: p.comment },
    { tag: tags.meta, color: p.meta },
    { tag: tags.separator, color: p.meta },
    { tag: tags.punctuation, color: p.meta },
    { tag: tags.squareBracket, color: p.meta },
    { tag: tags.brace, color: p.meta },
    { tag: tags.labelName, color: p.label },
    { tag: tags.typeName, color: p.type },
    { tag: tags.content, color: p.content },
    { tag: tags.attributeValue, color: p.attributeValue }
  ]);

  return [
    editorTheme,
    syntaxHighlighting(highlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true })
  ];
}
