import { lineChToPos } from './posUtils';

/**
 * Replace a single match.
 *
 * @param {import('@codemirror/view').EditorView} view
 * @param {Array}  matches
 * @param {number} matchIndex
 * @param {string} replaceText
 * @returns {{ endLine: number, endCh: number }}
 */
export function replaceSingle(view, matches, matchIndex, replaceText) {
  const match = matches[matchIndex];
  const doc = view.state.doc;
  const from = lineChToPos(doc, match.from);
  const to = lineChToPos(doc, match.to);

  view.dispatch({
    changes: { from, to, insert: replaceText }
  });

  const replaceLines = replaceText.split('\n');
  const endLine = match.from.line + replaceLines.length - 1;
  const endCh
    = replaceLines.length === 1
      ? match.from.ch + replaceText.length
      : replaceLines[replaceLines.length - 1].length;

  return { endLine, endCh };
}

/**
 * Replace all matches in one transaction.
 *
 * @param {import('@codemirror/view').EditorView} view
 * @param {Array}  matches
 * @param {string} replaceText
 */
export function replaceAll(view, matches, replaceText) {
  if (!matches.length) return;

  const doc = view.state.doc;
  // Apply from end to start so earlier positions stay valid
  const changes = matches
    .map((m) => ({
      from: lineChToPos(doc, m.from),
      to: lineChToPos(doc, m.to),
      insert: replaceText
    }))
    .sort((a, b) => b.from - a.from);

  view.dispatch({ changes });
}
