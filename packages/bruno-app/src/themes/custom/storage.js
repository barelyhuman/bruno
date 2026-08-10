import resolveCustomTheme from './resolveCustomTheme';

export const CUSTOM_THEMES_STORAGE_KEY = 'bruno.customThemes';

/**
 * Stored shape: Array<{ id, name, mode, base?, source }>
 * `source` is the original upload document; themes are re-resolved on load.
 */

export const loadCustomThemeRecords = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomThemeRecords = (records) => {
  localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(records));
};

export const getCustomThemeRecord = (id) => loadCustomThemeRecords().find((r) => r.id === id) || null;

export const upsertCustomThemeRecord = (record) => {
  const records = loadCustomThemeRecords().filter((r) => r.id !== record.id);
  records.push({
    id: record.id,
    name: record.name,
    mode: record.mode,
    base: record.base || null,
    source: record.source
  });
  saveCustomThemeRecords(records);
  return records;
};

export const removeCustomThemeRecord = (id) => {
  const records = loadCustomThemeRecords().filter((r) => r.id !== id);
  saveCustomThemeRecords(records);
  return records;
};

/**
 * Re-resolve all stored custom themes into runtime theme objects + registry entries.
 */
export const resolveStoredCustomThemes = () => {
  const records = loadCustomThemeRecords();
  const themes = {};
  const registry = {};
  const validRecords = [];

  for (const record of records) {
    const result = resolveCustomTheme(record.source || record, {
      allowOverwrite: true,
      existingIds: []
    });
    if (!result.ok) {
      console.error(`Failed to resolve custom theme "${record.id}":`, result.error);
      continue;
    }
    // Prefer stored id (already prefixed) over regenerated
    const id = record.id || result.id;
    themes[id] = result.theme;
    registry[id] = {
      id,
      name: record.name || result.name,
      mode: result.mode,
      custom: true
    };
    validRecords.push({
      id,
      name: record.name || result.name,
      mode: result.mode,
      base: result.base,
      source: record.source || result.source
    });
  }

  // Drop broken records so they don't keep failing silently forever
  if (validRecords.length !== records.length) {
    saveCustomThemeRecords(validRecords);
  }

  return { themes, registry, records: validRecords };
};

export default {
  loadCustomThemeRecords,
  saveCustomThemeRecords,
  upsertCustomThemeRecord,
  removeCustomThemeRecord,
  resolveStoredCustomThemes
};
