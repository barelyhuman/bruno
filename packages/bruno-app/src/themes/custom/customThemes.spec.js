import applyPalette from './applyPalette';
import deepMerge from './deepMerge';
import resolveCustomTheme, { toCustomThemeId, CUSTOM_THEME_PREFIX } from './resolveCustomTheme';
import {
  CUSTOM_THEMES_STORAGE_KEY,
  loadCustomThemeRecords,
  upsertCustomThemeRecord,
  removeCustomThemeRecord,
  saveCustomThemeRecords
} from './storage';

const minimalBase = {
  mode: 'dark',
  brand: '#111111',
  text: '#eeeeee',
  textLink: '#88c0d0',
  draftColor: '#cc7b1b',
  bg: '#000000',
  primary: { solid: '#111111', text: '#111111', strong: '#111111', subtle: '#111111' },
  accents: { primary: '#111111' },
  background: {
    base: '#000000',
    mantle: '#111111',
    crust: '#222222',
    surface0: '#222222',
    surface1: '#333333',
    surface2: '#444444'
  },
  status: {
    info: { background: 'rgba(0,0,255,0.15)', text: '#0000ff', border: '#0000ff' },
    success: { background: 'rgba(0,255,0,0.15)', text: '#00ff00', border: '#00ff00' },
    warning: { background: 'rgba(255,255,0,0.15)', text: '#ffff00', border: '#ffff00' },
    danger: { background: 'rgba(255,0,0,0.15)', text: '#ff0000', border: '#ff0000' }
  },
  overlay: { overlay2: '#666', overlay1: '#555', overlay0: '#444' },
  border: { border2: '#333', border1: '#222', border0: '#111', radius: { sm: '4px', base: '6px', md: '8px', lg: '10px', xl: '12px' } },
  colors: {
    text: {
      white: '#fff',
      green: '#0f0',
      danger: '#f00',
      warning: '#ff0',
      muted: '#888',
      purple: '#a0f',
      yellow: '#ff0',
      subtext2: '#ccc',
      subtext1: '#aaa',
      subtext0: '#888'
    },
    bg: { danger: '#f00' },
    accent: '#111'
  },
  sidebar: { color: '#eee', muted: '#888', bg: '#111' },
  codemirror: {
    bg: '#000',
    border: '#000',
    tokens: {
      definition: '#a3be8c',
      property: '#88c0d0',
      string: '#a3be8c',
      number: '#b48ead',
      atom: '#81a1c1',
      variable: '#d8dee9',
      keyword: '#81a1c1',
      comment: '#616e88',
      operator: '#81a1c1',
      tag: '#81a1c1',
      tagBracket: '#616e88'
    },
    variable: { valid: '#0f0', invalid: '#f00', prompt: '#00f' },
    placeholder: { color: '#888', opacity: 0.75 },
    gutter: { bg: '#000' },
    searchLineHighlightCurrent: 'rgba(0,0,0,0.1)',
    searchMatch: '#B8860B',
    searchMatchActive: '#DAA520'
  },
  console: { checkboxColor: '#111' },
  ws: { activeMessage: { label: '#111' } }
};

describe('deepMerge', () => {
  test('merges nested objects without mutating inputs', () => {
    const a = { x: 1, nested: { y: 2, z: 3 } };
    const b = { nested: { y: 9 }, w: 4 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ x: 1, nested: { y: 9, z: 3 }, w: 4 });
    expect(a.nested.y).toBe(2);
  });

  test('replaces arrays', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
  });
});

describe('applyPalette', () => {
  test('maps primary and background onto theme tokens', () => {
    const result = applyPalette(minimalBase, {
      primary: { solid: '#3b82f6', text: '#60a5fa', strong: '#2563eb', subtle: '#93c5fd' },
      background: { base: '#0f172a', mantle: '#1e293b' }
    });

    expect(result.brand).toBe('#3b82f6');
    expect(result.primary.solid).toBe('#3b82f6');
    expect(result.accents.primary).toBe('#3b82f6');
    expect(result.bg).toBe('#0f172a');
    expect(result.background.base).toBe('#0f172a');
    expect(result.background.mantle).toBe('#1e293b');
    expect(result.background.crust).toBe('#222222');
  });

  test('maps intent onto status colors', () => {
    const result = applyPalette(minimalBase, {
      intent: { danger: '#ef4444', success: '#22c55e' }
    });
    expect(result.status.danger.text).toBe('#ef4444');
    expect(result.status.success.text).toBe('#22c55e');
    expect(result.status.info.text).toBe('#0000ff');
  });

  test('maps syntax onto codemirror tokens', () => {
    const result = applyPalette(minimalBase, {
      syntax: { keyword: '#c084fc', string: '#86efac' }
    });
    expect(result.codemirror.tokens.keyword).toBe('#c084fc');
    expect(result.codemirror.tokens.string).toBe('#86efac');
    expect(result.codemirror.tokens.comment).toBe('#616e88');
  });

  test('maps hues onto request methods and derives intent/syntax', () => {
    const result = applyPalette(minimalBase, {
      hues: {
        red: '#ef4444',
        green: '#22c55e',
        blue: '#3b82f6',
        purple: '#a855f7',
        orange: '#f59e0b',
        pink: '#ec4899',
        indigo: '#6366f1',
        teal: '#14b8a6',
        cyan: '#06b6d4',
        rose: '#fb7185',
        brown: '#d97706'
      },
      text: { subtext1: '#94a3b8', subtext0: '#64748b' }
    });

    expect(result.request.methods.get).toBe('#22c55e');
    expect(result.request.methods.delete).toBe('#ef4444');
    expect(result.request.methods.post).toBe('#a855f7');
    expect(result.request.grpc).toBe('#6366f1');
    expect(result.textLink).toBe('#3b82f6');
    expect(result.status.danger.text).toBe('#ef4444');
    expect(result.status.success.text).toBe('#22c55e');
    expect(result.codemirror.tokens.keyword).toBe('#fb7185');
    expect(result.codemirror.tokens.string).toBe('#d97706');
    expect(result.codemirror.variable.valid).toBe('#22c55e');
  });

  test('propagates background and text across sidebar/modal/dropdown', () => {
    const result = applyPalette(minimalBase, {
      background: { base: '#0f172a', mantle: '#1e293b', crust: '#334155', surface0: '#1e293b', surface1: '#475569' },
      text: { base: '#e2e8f0', subtext1: '#94a3b8' },
      primary: { solid: '#3b82f6' },
      utility: { white: '#ffffff' },
      system: { controlAccent: '#38bdf8' }
    });

    expect(result.bg).toBe('#0f172a');
    // dark: sidebar on base, dropdown on mantle, editor on base
    expect(result.sidebar.bg).toBe('#0f172a');
    expect(result.dropdown.bg).toBe('#1e293b');
    expect(result.codemirror.bg).toBe('#0f172a');
    expect(result.sidebar.color).toBe('#e2e8f0');
    expect(result.modal.body.bg).toBe('#0f172a');
    expect(result.dropdown.hoverBg).toBe('#1e293b');
    expect(result.button2.color.primary.bg).toBe('#3b82f6');
    expect(result.colors.accent).toBe('#38bdf8');
    expect(result.workspace.accent).toBe('#38bdf8');
  });

  test('does not bleach dark code editor / dropdown with utility.white', () => {
    const darkBase = {
      ...minimalBase,
      mode: 'dark',
      dropdown: { bg: '#222224', color: '#eee', hoverBg: '#26292b', border: '#333333', separator: '#333333' },
      codemirror: {
        ...minimalBase.codemirror,
        bg: '#1a1a1a',
        border: '#1a1a1a',
        gutter: { bg: '#1a1a1a' }
      },
      input: { bg: 'transparent', border: '#444' },
      app: {
        collection: {
          toolbar: {
            environmentSelector: {
              bg: '#1a1a1a',
              border: '#444',
              icon: '#aaa',
              text: '#eee',
              caret: '#aaa',
              separator: '#444',
              hoverBg: '#1a1a1a',
              hoverBorder: '#666',
              noEnvironment: {
                text: '#aaa',
                bg: '#1a1a1a',
                border: '#444',
                hoverBg: '#1a1a1a',
                hoverBorder: '#666'
              }
            }
          }
        }
      }
    };

    const result = applyPalette(darkBase, {
      utility: { white: '#ffffff' },
      background: { base: '#0f172a', mantle: '#1e293b', surface2: '#475569' },
      border: { border1: '#334155', border2: '#475569' },
      text: { base: '#e2e8f0', subtext1: '#94a3b8' }
    });

    expect(result.colors.text.white).toBe('#ffffff');
    expect(result.codemirror.bg).toBe('#0f172a');
    expect(result.codemirror.border).toBe('#0f172a');
    expect(result.codemirror.gutter.bg).toBe('#0f172a');
    expect(result.dropdown.bg).toBe('#1e293b');
    expect(result.dropdown.border).toBe('#334155');
    expect(result.dropdown.separator).toBe('#334155');
    expect(result.input.bg).toBe('transparent');
    expect(result.app.collection.toolbar.environmentSelector.bg).toBe('#0f172a');
    expect(result.app.collection.toolbar.environmentSelector.border).toBe('#475569');
    expect(result.app.collection.toolbar.environmentSelector.separator).toBe('#475569');
    expect(result.app.collection.toolbar.environmentSelector.hoverBorder).toBe('#475569');
    expect(result.app.collection.toolbar.environmentSelector.text).toBe('#e2e8f0');
    expect(result.app.collection.toolbar.environmentSelector.caret).toBe('#94a3b8');
  });

  test('light mode maps panels to background.base (not only utility.white)', () => {
    const lightBase = { ...minimalBase, mode: 'light' };
    const result = applyPalette(lightBase, {
      background: { base: '#fafafa', mantle: '#f0f0f0' }
    });

    expect(result.codemirror.bg).toBe('#fafafa');
    expect(result.dropdown.bg).toBe('#fafafa');
    expect(result.input.bg).toBe('#fafafa');
    expect(result.sidebar.bg).toBe('#f0f0f0');
  });
});

describe('resolveCustomTheme', () => {
  test('resolves palette form with base only (derives mode)', () => {
    const result = resolveCustomTheme({
      id: 'ocean-dark',
      name: 'Ocean Dark',
      base: 'dark',
      palette: {
        primary: { solid: '#3b82f6', text: '#60a5fa', strong: '#2563eb', subtle: '#93c5fd' },
        background: { base: '#0f172a' }
      }
    });

    expect(result.ok).toBe(true);
    expect(result.id).toBe(`${CUSTOM_THEME_PREFIX}ocean-dark`);
    expect(result.mode).toBe('dark');
    expect(result.base).toBe('dark');
    expect(result.theme.brand).toBe('#3b82f6');
    expect(result.theme.bg).toBe('#0f172a');
    expect(result.theme.mode).toBe('dark');
  });

  test('resolves palette form with mode only (defaults base)', () => {
    const result = resolveCustomTheme({
      name: 'Soft Light',
      mode: 'light',
      palette: {
        primary: { solid: '#2563eb', text: '#1d4ed8', strong: '#1e40af', subtle: '#3b82f6' }
      }
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe('light');
    expect(result.base).toBe('light');
    expect(result.theme.brand).toBe('#2563eb');
  });

  test('resolves full form with base and overrides', () => {
    const result = resolveCustomTheme({
      id: 'dark-sidebar-tweak',
      name: 'Dark Sidebar Tweak',
      base: 'dark',
      overrides: {
        sidebar: { bg: '#111827' },
        brand: '#38bdf8'
      }
    });

    expect(result.ok).toBe(true);
    expect(result.theme.sidebar.bg).toBe('#111827');
    expect(result.theme.brand).toBe('#38bdf8');
    expect(result.theme.mode).toBe('dark');
  });

  test('fails when base is unknown', () => {
    const result = resolveCustomTheme({
      base: 'not-a-theme',
      palette: { primary: { solid: '#fff' } }
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Unknown base theme/);
  });

  test('fails when neither base nor mode is provided for palette form', () => {
    const result = resolveCustomTheme({
      palette: { primary: { solid: '#fff' } }
    });
    expect(result.ok).toBe(false);
  });

  test('fails on id collision with existing custom themes', () => {
    const first = resolveCustomTheme({
      id: 'dup',
      base: 'dark',
      palette: { primary: { solid: '#3b82f6', text: '#3b82f6', strong: '#3b82f6', subtle: '#3b82f6' } }
    });
    expect(first.ok).toBe(true);

    const second = resolveCustomTheme(
      {
        id: 'dup',
        base: 'dark',
        palette: { primary: { solid: '#ef4444', text: '#ef4444', strong: '#ef4444', subtle: '#ef4444' } }
      },
      { existingIds: [first.id] }
    );
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/already exists/);
  });

  test('toCustomThemeId prefixes and slugifies', () => {
    expect(toCustomThemeId('Ocean Dark')).toBe('custom:ocean-dark');
    expect(toCustomThemeId('custom:already')).toBe('custom:already');
  });
});

describe('custom theme storage', () => {
  beforeEach(() => {
    localStorage.removeItem(CUSTOM_THEMES_STORAGE_KEY);
  });

  test('round-trips records through localStorage', () => {
    upsertCustomThemeRecord({
      id: 'custom:ocean-dark',
      name: 'Ocean Dark',
      mode: 'dark',
      base: 'dark',
      source: { id: 'ocean-dark', name: 'Ocean Dark', base: 'dark', palette: { primary: { solid: '#3b82f6' } } }
    });

    const loaded = loadCustomThemeRecords();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('custom:ocean-dark');
    expect(loaded[0].name).toBe('Ocean Dark');

    removeCustomThemeRecord('custom:ocean-dark');
    expect(loadCustomThemeRecords()).toHaveLength(0);
  });

  test('saveCustomThemeRecords overwrites the list', () => {
    saveCustomThemeRecords([{ id: 'custom:a', name: 'A', mode: 'dark', source: {} }]);
    saveCustomThemeRecords([{ id: 'custom:b', name: 'B', mode: 'light', source: {} }]);
    expect(loadCustomThemeRecords().map((r) => r.id)).toEqual(['custom:b']);
  });
});
