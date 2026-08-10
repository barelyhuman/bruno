import React from 'react';
import { Validator } from 'jsonschema';
import toast from 'react-hot-toast';
import { parseToRgb } from 'polished';
import * as FileSaver from 'file-saver';
import themes from 'themes/index';
import themeSchema from 'themes/schema';
import {
  resolveCustomTheme,
  resolveStoredCustomThemes,
  upsertCustomThemeRecord,
  removeCustomThemeRecord,
  isCustomThemeId
} from 'themes/custom';
import { parseFileAsJsonOrYaml } from 'utils/importers/file-reader';
import useLocalStorage from 'hooks/useLocalStorage/index';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';

const validator = new Validator();

const getEffectiveTheme = (storedTheme) => {
  if (storedTheme === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return storedTheme;
};

const applyThemeToRoot = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};

const loadCustomState = () => {
  try {
    return resolveStoredCustomThemes();
  } catch (err) {
    console.error('Failed to load custom themes:', err);
    return { themes: {}, registry: {}, records: [] };
  }
};

export const ThemeContext = createContext();
export const ThemeProvider = (props) => {
  const [storedTheme, setStoredTheme] = useLocalStorage('bruno.theme', 'system');
  const [displayedTheme, setDisplayedTheme] = useState(() => getEffectiveTheme(storedTheme));
  const [themeVariantLight, setThemeVariantLight] = useLocalStorage('bruno.themeVariantLight', 'light');
  const [themeVariantDark, setThemeVariantDark] = useLocalStorage('bruno.themeVariantDark', 'dark');
  const [customState, setCustomState] = useState(loadCustomState);

  const allThemes = useMemo(() => ({ ...themes, ...customState.themes }), [customState.themes]);
  const customThemesRegistry = customState.registry;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => {
      if (storedTheme !== 'system') return;
      const newTheme = e.matches ? 'light' : 'dark';
      setDisplayedTheme(newTheme);
      applyThemeToRoot(newTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(storedTheme);
    setDisplayedTheme(effectiveTheme);
    applyThemeToRoot(effectiveTheme);

    if (window.ipcRenderer) {
      const isLight = effectiveTheme === 'light';
      const variantName = isLight ? themeVariantLight : themeVariantDark;
      const rawBg = allThemes[variantName]?.bg || (isLight ? '#ffffff' : '#1e1e1e');
      const { red, green, blue } = parseToRgb(rawBg);
      const themeBg = `#${[red, green, blue].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
      window.ipcRenderer.send('renderer:theme-change', storedTheme, themeBg);
    }
  }, [storedTheme, themeVariantLight, themeVariantDark, allThemes]);

  const theme = useMemo(() => {
    const isLightMode = getEffectiveTheme(storedTheme) === 'light';
    const variantName = isLightMode ? themeVariantLight : themeVariantDark;
    const fallbackTheme = isLightMode ? themes.light : themes.dark;
    const fallbackName = isLightMode ? 'light' : 'dark';

    const selectedTheme = allThemes[variantName];
    if (!selectedTheme) {
      if (variantName !== fallbackName) {
        toast.error(`Theme "${variantName}" not found. Using default ${fallbackName} theme.`, {
          duration: 4000,
          id: `theme-not-found-${variantName}`
        });
      }
      return fallbackTheme;
    }

    const validationResult = validator.validate(selectedTheme, themeSchema);
    if (!validationResult.valid) {
      const errors = validationResult.errors?.map((e) => e.stack).join(', ') || 'Unknown validation error';
      console.error(`Theme "${variantName}" validation failed:`, errors);
      toast.error(`Invalid theme "${variantName}". Using default ${fallbackName} theme.`, {
        duration: 4000,
        id: `theme-invalid-${variantName}`
      });
      return fallbackTheme;
    }

    return selectedTheme;
  }, [storedTheme, themeVariantLight, themeVariantDark, allThemes]);

  const importCustomTheme = useCallback(
    async (input) => {
      let doc = input;
      if (typeof File !== 'undefined' && input instanceof File) {
        doc = await parseFileAsJsonOrYaml(input);
      }

      const existingIds = Object.keys(customState.themes);
      const result = resolveCustomTheme(doc, { existingIds, allowOverwrite: false });
      if (!result.ok) {
        toast.error(result.error, { duration: 5000 });
        return null;
      }

      upsertCustomThemeRecord({
        id: result.id,
        name: result.name,
        mode: result.mode,
        base: result.base,
        source: result.source
      });

      setCustomState(resolveStoredCustomThemes());

      if (result.mode === 'light') {
        setThemeVariantLight(result.id);
      } else {
        setThemeVariantDark(result.id);
      }

      toast.success(`Imported theme "${result.name}"`);
      return result;
    },
    [customState.themes, setThemeVariantLight, setThemeVariantDark]
  );

  const removeCustomTheme = useCallback(
    (id) => {
      if (!isCustomThemeId(id)) return;

      removeCustomThemeRecord(id);
      setCustomState(resolveStoredCustomThemes());

      if (themeVariantLight === id) {
        setThemeVariantLight('light');
      }
      if (themeVariantDark === id) {
        setThemeVariantDark('dark');
      }

      toast.success('Custom theme removed');
    },
    [themeVariantLight, themeVariantDark, setThemeVariantLight, setThemeVariantDark]
  );

  const exportCustomTheme = useCallback(
    (id) => {
      const record = customState.records.find((r) => r.id === id);
      const themeObj = allThemes[id];
      if (!themeObj) {
        toast.error('Theme not found');
        return;
      }

      const payload = record?.source
        ? record.source
        : {
            id: id.replace(/^custom:/, ''),
            name: customState.registry[id]?.name || id,
            mode: themeObj.mode,
            theme: themeObj
          };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const filename = `${(payload.name || id).toString().replace(/\s+/g, '-').toLowerCase()}.json`;
      FileSaver.saveAs(blob, filename);
    },
    [allThemes, customState.records, customState.registry]
  );

  const value = {
    theme,
    storedTheme,
    displayedTheme,
    setStoredTheme,
    themeVariantLight,
    setThemeVariantLight,
    themeVariantDark,
    setThemeVariantDark,
    allThemes,
    customThemesRegistry,
    customThemes: customState.records,
    importCustomTheme,
    removeCustomTheme,
    exportCustomTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <SCThemeProvider theme={theme} {...props} />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(`useTheme must be used within a ThemeProvider`);
  }

  return context;
};

export default ThemeProvider;
