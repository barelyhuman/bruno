import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { markdown } from '@codemirror/lang-markdown';
import { yaml } from '@codemirror/lang-yaml';
import { xml } from '@codemirror/lang-xml';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { protobuf } from '@codemirror/legacy-modes/mode/protobuf';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';

const YAML_MODES = new Set(['yaml', 'text/x-yaml', 'text/yaml', 'application/x-yaml', 'application/yaml']);
const JSON_MODES = new Set(['application/json', 'application/ld+json', 'json']);
const JS_MODES = new Set(['javascript', 'text/javascript', 'application/javascript']);

export function isYamlMode(mode) {
  return Boolean(mode && YAML_MODES.has(mode));
}

export function isJsonMode(mode) {
  return Boolean(mode && JSON_MODES.has(mode));
}

/**
 * Map Bruno CM5 mode strings to CM6 LanguageSupport extensions.
 */
export function getLanguageSupport(mode) {
  if (!mode) return [];

  if (YAML_MODES.has(mode)) return [yaml()];
  if (JSON_MODES.has(mode)) return [json()];
  if (JS_MODES.has(mode)) return [javascript({ jsx: false })];
  if (mode === 'htmlmixed' || mode === 'text/html') return [html()];
  if (mode === 'gfm' || mode === 'markdown') return [markdown()];
  if (mode === 'application/xml' || mode === 'xml') return [xml()];
  if (mode === 'css') return [css()];
  if (mode === 'python') return [python()];
  if (mode === 'rust') return [rust()];
  if (mode === 'php') return [php()];
  if (mode === 'sql') return [sql()];
  if (mode === 'go') return [StreamLanguage.define(go)];
  if (mode === 'ruby') return [StreamLanguage.define(ruby)];
  if (mode === 'shell') return [StreamLanguage.define(shell)];
  if (mode === 'swift') return [StreamLanguage.define(swift)];
  if (mode === 'protobuf') return [StreamLanguage.define(protobuf)];
  if (mode === 'sparql') return [StreamLanguage.define(sparql)];

  return [];
}

export const getCodeMirrorModeBasedOnContentType = (contentType, body) => {
  if (typeof body === 'object') {
    return 'application/ld+json';
  }
  if (!contentType || typeof contentType !== 'string') {
    return 'application/text';
  }

  if (contentType.includes('json')) {
    return 'application/ld+json';
  } else if (contentType.includes('javascript') || contentType.includes('ecmascript')) {
    return 'application/javascript';
  } else if (contentType.includes('image')) {
    return 'application/image';
  } else if (contentType.includes('xml')) {
    return 'application/xml';
  } else if (contentType.includes('html')) {
    return 'application/html';
  } else if (contentType.includes('text')) {
    return 'application/text';
  } else if (contentType.includes('application/edn')) {
    return 'application/xml';
  } else if (contentType.includes('yaml')) {
    return 'application/yaml';
  }
  return 'application/text';
};
