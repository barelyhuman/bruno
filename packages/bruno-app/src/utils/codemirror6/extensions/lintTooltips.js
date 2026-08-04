import { setupLintErrorTooltip } from 'utils/codemirror/lint-errors';
import { createCm5Compat } from '../compat';

export function setupLintErrorTooltip6(view) {
  if (!view) return () => {};
  const compat = createCm5Compat(view);
  return setupLintErrorTooltip(compat);
}
