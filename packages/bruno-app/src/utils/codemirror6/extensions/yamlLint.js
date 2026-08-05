import jsyaml from 'js-yaml';
import { linter } from '@codemirror/lint';

/**
 * Build YAML parse diagnostics for a CM6 document.
 */
export function yamlDiagnostics(doc, text) {
  if (!text.trim()) return [];

  try {
    jsyaml.loadAll(text);
    return [];
  } catch (error) {
    const mark = error.mark;
    if (!mark) {
      return [{ from: 0, to: 1, message: error.message || 'Invalid YAML', severity: 'error' }];
    }

    try {
      const line = doc.line(mark.line + 1);
      const from = Math.min(line.from + mark.column, line.to);
      const to = Math.max(from + 1, line.to);
      return [{ from, to, message: error.message || 'Invalid YAML', severity: 'error' }];
    } catch {
      return [{ from: 0, to: 1, message: error.message || 'Invalid YAML', severity: 'error' }];
    }
  }
}

export function brunoYamlLinter() {
  return linter(
    (view) => yamlDiagnostics(view.state.doc, view.state.doc.toString()),
    { delay: 300 }
  );
}
