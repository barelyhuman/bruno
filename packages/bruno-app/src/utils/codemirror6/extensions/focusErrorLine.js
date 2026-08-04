import { EditorView } from '@codemirror/view';

const LINE_CLASS = 'cm-error-line-flash';
const GUTTER_CLASS = 'cm-error-line-flash-gutter';

export const focusErrorLine = (editor, line1Based, { durationMs = 3000 } = {}) => {
  if (!editor || typeof line1Based !== 'number' || Number.isNaN(line1Based)) {
    return () => {};
  }

  const view = editor.view || editor;
  if (!view?.state?.doc) return () => {};

  const lineCount = view.state.doc.lines;
  const line = Math.max(0, Math.min(line1Based - 1, lineCount - 1));

  try {
    const lineInfo = view.state.doc.line(line + 1);
    view.dispatch({
      effects: EditorView.scrollIntoView(lineInfo.from, { y: 'center', yMargin: 80 })
    });
    editor.addLineClass?.(line, 'background', LINE_CLASS);
    editor.addLineClass?.(line, 'gutter', GUTTER_CLASS);
  } catch {
    return () => {};
  }

  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    try {
      editor.removeLineClass?.(line, 'background', LINE_CLASS);
      editor.removeLineClass?.(line, 'gutter', GUTTER_CLASS);
    } catch {
      // editor may have been destroyed
    }
  };

  const timer = setTimeout(dispose, durationMs);
  return () => {
    clearTimeout(timer);
    dispose();
  };
};
