import { setupAiAutocomplete } from 'utils/codemirror/aiGhostText';
import { createCm5Compat } from '../compat';

export function setupAiAutocomplete6(view, options) {
  if (!view) return () => {};
  const compat = createCm5Compat(view);
  return setupAiAutocomplete(compat, options);
}
