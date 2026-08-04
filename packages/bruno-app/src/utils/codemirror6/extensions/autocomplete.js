import { setupAutoComplete as setupAutoCompleteCm5 } from 'utils/codemirror/autocomplete';
import { createCm5Compat } from '../compat';

/**
 * CM6 wrapper — reuses CM5 autocomplete via compat shim.
 */
export function setupAutoComplete6(view, options = {}) {
  if (!view) return () => {};
  const compat = createCm5Compat(view);
  return setupAutoCompleteCm5(compat, options);
}

export { showRootHints } from 'utils/codemirror/autocomplete';
