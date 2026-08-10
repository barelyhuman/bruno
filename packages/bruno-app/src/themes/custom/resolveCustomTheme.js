import { Validator } from 'jsonschema';
import builtInThemes, { themeRegistry } from '../index';
import themeSchema from '../schema';
import applyPalette from './applyPalette';
import deepMerge from './deepMerge';
import paletteSchema from './paletteSchema';

const validator = new Validator();

const META_KEYS = new Set(['id', 'name', 'mode', 'base', 'palette', 'overrides', 'theme']);

export const CUSTOM_THEME_PREFIX = 'custom:';

export const toCustomThemeId = (rawId) => {
  const raw = String(rawId || '').trim();
  if (raw.startsWith(CUSTOM_THEME_PREFIX)) {
    return raw;
  }
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${CUSTOM_THEME_PREFIX}${slug || 'theme'}`;
};

export const isCustomThemeId = (id) => typeof id === 'string' && id.startsWith(CUSTOM_THEME_PREFIX);

const cloneTheme = (theme) => deepMerge({}, theme);

const firstError = (result) => result.errors?.[0]?.stack || result.errors?.[0]?.message || 'Validation failed';

const resolveBaseAndMode = (doc) => {
  let baseId = doc.base;
  let mode = doc.mode;

  if (baseId) {
    const builtIn = builtInThemes[baseId];
    if (!builtIn) {
      return { error: `Unknown base theme "${baseId}"` };
    }
    // base alone is enough — derive mode from the built-in
    mode = builtIn.mode;
    return { baseId, mode, baseTheme: builtIn };
  }

  if (mode === 'light' || mode === 'dark') {
    // mode alone defaults base to the matching built-in
    baseId = mode;
    return { baseId, mode, baseTheme: builtInThemes[baseId] };
  }

  return { error: 'Provide either "base" (built-in theme id) or "mode" (light|dark)' };
};

const extractFullThemeTokens = (doc) => {
  if (doc.theme && typeof doc.theme === 'object') {
    return doc.theme;
  }

  const tokens = {};
  for (const key of Object.keys(doc)) {
    if (!META_KEYS.has(key)) {
      tokens[key] = doc[key];
    }
  }
  return tokens;
};

/**
 * Resolve a custom theme document (palette form or full form) into a runtime theme.
 * @returns {{ ok: true, id, name, mode, base, theme, source } | { ok: false, error: string }}
 */
export const resolveCustomTheme = (doc, options = {}) => {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, error: 'Theme document must be an object' };
  }

  const existingIds = options.existingIds || [];
  const hasPalette = doc.palette != null && typeof doc.palette === 'object';

  let baseId;
  let mode;
  let baseTheme;
  let theme;

  if (hasPalette) {
    const paletteValidation = validator.validate(doc, paletteSchema);
    if (!paletteValidation.valid) {
      return { ok: false, error: firstError(paletteValidation) };
    }

    const resolved = resolveBaseAndMode(doc);
    if (resolved.error) {
      return { ok: false, error: resolved.error };
    }
    ({ baseId, mode, baseTheme } = resolved);

    theme = applyPalette(cloneTheme(baseTheme), doc.palette);
    if (doc.overrides && typeof doc.overrides === 'object') {
      theme = deepMerge(theme, doc.overrides);
    }
  } else {
    const tokens = extractFullThemeTokens(doc);
    const hasTokens = Object.keys(tokens).length > 0;

    if (doc.base || doc.mode) {
      const resolved = resolveBaseAndMode(doc);
      if (resolved.error) {
        return { ok: false, error: resolved.error };
      }
      ({ baseId, mode, baseTheme } = resolved);
      theme = hasTokens ? deepMerge(cloneTheme(baseTheme), tokens) : cloneTheme(baseTheme);
      if (doc.overrides && typeof doc.overrides === 'object') {
        theme = deepMerge(theme, doc.overrides);
      }
    } else if (hasTokens) {
      theme = cloneTheme(tokens);
      mode = theme.mode;
      if (mode !== 'light' && mode !== 'dark') {
        return { ok: false, error: 'Full theme must include mode: "light" or "dark", or set base/mode' };
      }
    } else {
      return { ok: false, error: 'Provide a palette, theme tokens, or a base theme to clone' };
    }
  }

  // Ensure mode on the resolved theme matches derived mode
  theme = { ...theme, mode };

  const themeValidation = validator.validate(theme, themeSchema);
  if (!themeValidation.valid) {
    return { ok: false, error: firstError(themeValidation) };
  }

  const id = toCustomThemeId(doc.id || doc.name || `${mode}-custom`);
  if (themeRegistry[id] || (builtInThemes[id] && !isCustomThemeId(id))) {
    return { ok: false, error: `Theme id "${id}" conflicts with a built-in theme` };
  }
  if (existingIds.includes(id) && !options.allowOverwrite) {
    return { ok: false, error: `Theme id "${id}" already exists. Choose a different id or remove the existing theme.` };
  }

  const name = (doc.name && String(doc.name).trim()) || id.replace(CUSTOM_THEME_PREFIX, '');

  // Persist the original upload (minus nothing — keep source as-is for re-resolve)
  const source = { ...doc, id: id.replace(CUSTOM_THEME_PREFIX, ''), name, mode, ...(baseId && { base: baseId }) };

  return {
    ok: true,
    id,
    name,
    mode,
    base: baseId || null,
    theme,
    source
  };
};

export default resolveCustomTheme;
