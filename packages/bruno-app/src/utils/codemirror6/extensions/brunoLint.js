import { linter } from '@codemirror/lint';
import { JSHINT } from 'jshint';
import { filter } from 'lodash';

const DEFAULT_OPTIONS = {
  esversion: 11,
  expr: true,
  asi: true,
  undef: true,
  browser: true,
  devel: true,
  module: true,
  node: true,
  predef: {
    bru: false,
    req: false,
    res: false,
    test: false,
    expect: false,
    require: false,
    module: false
  }
};

function validateJavaScript(text, options) {
  if (!text.trim()) return [];

  const merged = { ...DEFAULT_OPTIONS, ...options };
  if (!merged.indent) merged.indent = 1;

  JSHINT(text, merged, merged.globals);
  let errors = JSHINT.data()?.errors;
  if (!errors) return [];

  errors = filter(errors, (error) => {
    if (error.code === 'E058' || error.code === 'W024') {
      if (error.evidence?.includes('await') && error.scope === '(main)') {
        return false;
      }
      return true;
    }
    if (error.code === 'W079' && (error.a === 'atob' || error.a === 'btoa')) {
      return false;
    }
    return true;
  });

  const diagnostics = [];
  const lines = text.split('\n');

  for (const error of errors) {
    if (!error || error.line <= 0) continue;

    let start = error.character - 1;
    let end = start + 1;
    if (error.evidence) {
      const index = error.evidence.substring(start).search(/.\b/);
      if (index > -1) end += index;
    }

    const lineStart = lines.slice(0, error.line - 1).reduce((acc, l) => acc + l.length + 1, 0);
    diagnostics.push({
      from: lineStart + start,
      to: lineStart + end,
      message: error.reason,
      severity: error.code?.startsWith('W') ? 'warning' : 'error'
    });
  }

  return diagnostics;
}

/**
 * CM6 JavaScript linter using JSHINT (ported from javascript-lint.js).
 */
export function brunoJavaScriptLinter(options = {}) {
  return linter((view) => {
    const text = view.state.doc.toString();
    return validateJavaScript(text, options);
  });
}
