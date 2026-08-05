import * as jsonlint from '@prantlf/jsonlint';
import stripJsonComments from 'strip-json-comments';
import { linter } from '@codemirror/lint';

export function brunoJsonLinter() {
  return linter((view) => {
    const text = view.state.doc.toString();
    if (!text.trim()) return [];

    const parser = jsonlint.parser || jsonlint;
    try {
      parser.parse(
        stripJsonComments(text.replace(/(?<!"[^":{]*){{[^}]*}}(?![^"},]*")/g, '1'))
      );
      return [];
    } catch (error) {
      const { message, location } = error;
      const line = location?.start?.line;
      const column = location?.start?.column;
      if (!line || !column) return [];

      const lineInfo = view.state.doc.line(line);
      const from = lineInfo.from + column - 1;
      return [{ from, to: from + 1, message, severity: 'error' }];
    }
  });
}
