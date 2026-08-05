import { Decoration } from '@codemirror/view';
import { lineChToPos } from './posUtils';
import { setSearchMarksEffect } from './searchMarksExtension';

const VIEWPORT_BUFFER = 100;

/**
 * Clears existing search decorations and redraws matches visible in the
 * current viewport ± VIEWPORT_BUFFER lines. Always marks the active match.
 *
 * @param {import('@codemirror/view').EditorView} view
 * @param {Array}  matches
 * @param {number} activeIndex
 */
export function markViewportMatches(view, matches, activeIndex) {
  if (!view) return;

  if (!matches.length) {
    clearMarks(view);
    return;
  }

  const doc = view.state.doc;
  const fromLine = Math.max(0, doc.lineAt(view.viewport.from).number - 1 - VIEWPORT_BUFFER);
  const toLine = doc.lineAt(Math.min(view.viewport.to, doc.length)).number - 1 + VIEWPORT_BUFFER;

  let lo = 0;
  let hi = matches.length - 1;
  let start = matches.length;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (matches[mid].from.line >= fromLine) {
      start = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  const ranges = [];
  const marked = new Set();

  for (let i = start; i < matches.length && matches[i].from.line <= toLine; i++) {
    const from = lineChToPos(doc, matches[i].from);
    const to = lineChToPos(doc, matches[i].to);
    if (from >= to) continue;
    ranges.push(
      Decoration.mark({
        class: i === activeIndex ? 'cm-search-match-current' : 'cm-search-match'
      }).range(from, to)
    );
    marked.add(i);
  }

  if (!marked.has(activeIndex) && matches[activeIndex]) {
    const from = lineChToPos(doc, matches[activeIndex].from);
    const to = lineChToPos(doc, matches[activeIndex].to);
    if (from < to) {
      ranges.push(
        Decoration.mark({ class: 'cm-search-match-current' }).range(from, to)
      );
    }
  }

  if (matches[activeIndex]) {
    const line = doc.line(Math.min(matches[activeIndex].from.line + 1, doc.lines));
    ranges.push(Decoration.line({ class: 'cm-search-line-highlight' }).range(line.from));
  }

  view.dispatch({
    effects: setSearchMarksEffect.of(Decoration.set(ranges, true))
  });
}

/**
 * @param {import('@codemirror/view').EditorView} view
 */
export function clearMarks(view) {
  if (!view) return;
  view.dispatch({
    effects: setSearchMarksEffect.of(Decoration.none)
  });
}
