import { MaskedEditor } from 'utils/common/masked-editor';
import { createCm5Compat } from '../compat';

/**
 * CM6 wrapper — reuses CM5 MaskedEditor via compat shim.
 */
export function createMaskedEditor6(view, maskChar = '*') {
  const compat = createCm5Compat(view);
  return new MaskedEditor(compat, maskChar);
}
