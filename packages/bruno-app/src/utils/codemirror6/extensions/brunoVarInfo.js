import { createCm5Compat } from '../compat';

/**
 * Wire CM5 brunoVarInfo tooltip addon via compat shim.
 * Requires brunoVarInfo module side-effect (defineOption) to be loaded.
 */
export function setupBrunoVarInfo6(view, options) {
  if (!view || !options) return () => {};

  require('utils/codemirror/brunoVarInfo');
  const compat = createCm5Compat(view);
  compat.setOption('brunoVarInfo', options);
  return () => {
    compat.setOption('brunoVarInfo', false);
  };
}
