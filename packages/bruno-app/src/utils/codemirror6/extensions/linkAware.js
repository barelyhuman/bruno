import { setupLinkAware as setupLinkAwareCm5 } from 'utils/codemirror/linkAware';
import { createCm5Compat } from '../compat';

/**
 * CM6 wrapper — reuses CM5 linkAware via compat shim.
 */
export function setupLinkAware6(view) {
  if (!view) return () => {};
  const compat = createCm5Compat(view);
  setupLinkAwareCm5(compat);
  return () => {
    compat._destroyLinkAware?.();
  };
}
