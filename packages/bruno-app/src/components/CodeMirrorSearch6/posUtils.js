/**
 * Convert a CM6 absolute document position to CM5-style { line, ch } (0-based line).
 * @param {import('@codemirror/state').Text} doc
 * @param {number} pos
 */
export function posToLineCh(doc, pos) {
  const line = doc.lineAt(pos);
  return { line: line.number - 1, ch: pos - line.from };
}

/**
 * Convert CM5-style { line, ch } to a CM6 absolute document position.
 * @param {import('@codemirror/state').Text} doc
 * @param {{ line: number, ch: number }} loc
 */
export function lineChToPos(doc, { line, ch }) {
  const lineObj = doc.line(Math.min(line + 1, doc.lines));
  return Math.min(lineObj.from + Math.max(0, ch), lineObj.to);
}

/**
 * Selection helpers for an EditorView.
 * @param {import('@codemirror/view').EditorView} view
 */
export function getSelectionText(view) {
  const { from, to } = view.state.selection.main;
  if (from === to) return '';
  return view.state.sliceDoc(from, to);
}

/**
 * @param {import('@codemirror/view').EditorView} view
 * @returns {{ line: number, ch: number }}
 */
export function getCursorLineCh(view) {
  return posToLineCh(view.state.doc, view.state.selection.main.from);
}
