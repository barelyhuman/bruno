import { captureEditorState, applyEditorState } from 'components/CodeEditor/state-persistence';
import { createCm5Compat } from '../compat';

export function captureEditorState6(view) {
  const compat = createCm5Compat(view);
  return captureEditorState(compat);
}

export function applyEditorState6(view, state, currentContent) {
  const compat = createCm5Compat(view);
  applyEditorState(compat, state, currentContent);
}
