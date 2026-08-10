export { default as deepMerge } from './deepMerge';
export { default as applyPalette } from './applyPalette';
export { default as paletteSchema } from './paletteSchema';
export {
  default as resolveCustomTheme,
  toCustomThemeId,
  isCustomThemeId,
  CUSTOM_THEME_PREFIX
} from './resolveCustomTheme';
export {
  CUSTOM_THEMES_STORAGE_KEY,
  loadCustomThemeRecords,
  saveCustomThemeRecords,
  upsertCustomThemeRecord,
  removeCustomThemeRecord,
  resolveStoredCustomThemes
} from './storage';
