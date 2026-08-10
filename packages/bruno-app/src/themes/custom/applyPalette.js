import { rgba } from 'polished';
import deepMerge from './deepMerge';

/**
 * Normalize a user palette: fill derived intent/syntax from hues when omitted,
 * and camelCase hue aliases (greenDark).
 */
const normalizePalette = (palette = {}) => {
  const p = deepMerge({}, palette);
  const hues = p.hues;

  if (hues && !p.intent) {
    p.intent = {
      ...(hues.blue && { info: hues.blue }),
      ...(hues.green && { success: hues.green }),
      ...(hues.orange && { warning: hues.orange }),
      ...(hues.red && { danger: hues.red })
    };
  }

  if (hues && !p.syntax) {
    p.syntax = {
      ...(hues.rose && { keyword: hues.rose, tag: hues.rose, atom: hues.rose }),
      ...(hues.pink && { variable: hues.pink, number: hues.pink }),
      ...(hues.blue && { property: hues.blue, definition: hues.blue }),
      ...(hues.brown && { string: hues.brown }),
      ...(p.text?.subtext1 && { operator: p.text.subtext1, tagBracket: p.text.subtext1 }),
      ...(p.text?.subtext0 && { comment: p.text.subtext0 })
    };
  }

  if (p.primary?.solid) {
    p.primary = {
      text: p.primary.solid,
      strong: p.primary.solid,
      subtle: p.primary.solid,
      ...p.primary
    };
  }

  if (!p.textLink && hues?.blue) {
    p.textLink = hues.blue;
  }

  return p;
};

const setPath = (obj, path, value) => {
  if (value === undefined) return;
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    cur[key] = cur[key] && typeof cur[key] === 'object' ? { ...cur[key] } : {};
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
};

/**
 * Apply a user palette onto a cloned built-in theme.
 * Mirrors the derivation in themes/light/light.js and themes/dark/dark.js:
 * palette sections (primary, hues, background, text, …) fan out across theme tokens.
 */
const applyPalette = (theme, palette = {}) => {
  const next = deepMerge({}, theme);
  const p = normalizePalette(palette);
  const { primary, background, text, overlay, border, intent, syntax, hues, system, utility, textLink, draftColor } =
    p;

  if (primary) {
    if (primary.solid) {
      next.brand = primary.solid;
      setPath(next, 'accents.primary', primary.solid);
      setPath(next, 'button2.color.primary.bg', primary.solid);
      setPath(next, 'button2.color.primary.border', primary.solid);
      setPath(next, 'button2.color.light.bg', rgba(primary.solid, 0.08));
      setPath(next, 'button2.color.light.text', primary.solid);
      setPath(next, 'button2.color.light.border', rgba(primary.solid, 0.06));
      setPath(next, 'console.checkboxColor', primary.solid);
      if (utility?.white) {
        setPath(next, 'button2.color.primary.text', utility.white);
      }
    }
    next.primary = { ...next.primary, ...primary };
    if (primary.text) {
      setPath(next, 'ws.activeMessage.label', primary.text);
      setPath(next, 'dropdown.selectedColor', primary.text);
      setPath(next, 'app.collection.toolbar.environmentSelector.icon', primary.text);
    }
    if (primary.strong) {
      setPath(next, 'tabs.active.border', primary.strong);
    }
  }

  if (system?.controlAccent) {
    setPath(next, 'colors.accent', system.controlAccent);
    setPath(next, 'workspace.accent', system.controlAccent);
  }

  const isLight = next.mode === 'light';

  // utility.white is contrast text on filled buttons — NOT editor/dropdown surfaces.
  // Light themes happen to use white for those surfaces; dark themes use background.*.
  if (utility?.white) {
    setPath(next, 'colors.text.white', utility.white);
    if (next.button2?.color) {
      ['primary', 'success', 'warning', 'danger'].forEach((key) => {
        if (next.button2.color[key]) {
          setPath(next, `button2.color.${key}.text`, utility.white);
        }
      });
    }
  }

  if (background) {
    next.background = { ...next.background, ...background };
    if (background.base) {
      next.bg = background.base;
      // CodeMirror tracks background.base in both light and dark built-ins
      setPath(next, 'codemirror.bg', background.base);
      setPath(next, 'codemirror.border', background.base);
      setPath(next, 'codemirror.gutter.bg', background.base);
      setPath(next, 'requestTabPanel.card.bg', background.base);
      setPath(next, 'requestTabPanel.graphqlDocsExplorer.bg', background.base);
      setPath(next, 'requestTabPanel.url.bg', background.base);
      setPath(next, 'notifications.bg', background.base);
      setPath(next, 'notifications.list.bg', background.base);
      setPath(next, 'modal.body.bg', background.base);
      setPath(next, 'modal.input.bg', background.base);
      // Environment selector trigger sits on background.base in both light and dark
      setPath(next, 'app.collection.toolbar.environmentSelector.bg', background.base);
      setPath(next, 'app.collection.toolbar.environmentSelector.hoverBg', background.base);
      setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.bg', background.base);
      setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.hoverBg', background.base);

      if (isLight) {
        // light.js: input/dropdown/toolbar panels use utility.WHITE ≈ background.BASE
        setPath(next, 'input.bg', background.base);
        setPath(next, 'dropdown.bg', background.base);
      } else {
        // dark.js: sidebar sits on BASE (input stays transparent — leave it)
        setPath(next, 'sidebar.bg', background.base);
      }
    }
    if (background.mantle) {
      if (isLight) {
        setPath(next, 'sidebar.bg', background.mantle);
      } else {
        // dark.js: dropdown.bg = MANTLE
        setPath(next, 'dropdown.bg', background.mantle);
      }
      setPath(next, 'workspace.button.bg', background.mantle);
      setPath(next, 'button2.color.secondary.bg', background.mantle);
    }
    if (background.crust) {
      if (isLight) {
        setPath(next, 'dropdown.hoverBg', background.crust);
      }
      setPath(next, 'requestTabs.bg', background.crust);
      setPath(next, 'plainGrid.hoverBg', background.crust);
    }
    if (background.surface0) {
      setPath(next, 'notifications.list.active.bg', background.surface0);
      setPath(next, 'modal.title.bg', background.surface0);
      setPath(next, 'tabs.secondary.inactive.bg', background.surface0);
      setPath(next, 'table.striped', background.surface0);
      if (!isLight) {
        // dark.js: dropdown.hoverBg = SURFACE0
        setPath(next, 'dropdown.hoverBg', background.surface0);
      }
    }
    if (background.surface1) {
      setPath(next, 'sidebar.collection.item.bg', background.surface1);
      setPath(next, 'sidebar.collection.item.hoverBg', background.surface1);
      setPath(next, 'notifications.list.hoverBg', background.surface1);
      setPath(next, 'tabs.secondary.active.bg', background.surface1);
      setPath(next, 'requestTabs.icon.hoverBg', background.surface1);
      setPath(next, 'infoTip.border', background.surface1);
    }
    if (background.surface2) {
      setPath(next, 'sidebar.dragbar.border', background.surface2);
      setPath(next, 'sidebar.dragbar.activeBorder', background.surface2);
      setPath(next, 'requestTabPanel.dragbar.border', background.surface2);
      setPath(next, 'notifications.list.active.hoverBg', background.surface2);
      if (!isLight) {
        // dark.js: env selector hoverBorder ≈ GRAY_4 / SURFACE2
        setPath(next, 'app.collection.toolbar.environmentSelector.hoverBorder', background.surface2);
        setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.hoverBorder', background.surface2);
      }
    }
  }

  if (text) {
    if (text.base) {
      next.text = text.base;
      setPath(next, 'sidebar.color', text.base);
      setPath(next, 'dropdown.color', text.base);
      setPath(next, 'modal.title.color', text.base);
      setPath(next, 'modal.body.color', text.base);
      setPath(next, 'requestTabPanel.graphqlDocsExplorer.color', text.base);
      setPath(next, 'tabs.active.color', text.base);
      setPath(next, 'tabs.secondary.active.color', text.base);
      setPath(next, 'requestTabs.color', text.base);
      setPath(next, 'requestTabs.icon.hoverColor', text.base);
      setPath(next, 'table.input.color', text.base);
      setPath(next, 'button2.color.secondary.text', text.base);
      setPath(next, 'deprecationWarning.text', text.base);
      setPath(next, 'app.collection.toolbar.environmentSelector.text', text.base);
    }
    if (text.subtext2 !== undefined) {
      setPath(next, 'colors.text.subtext2', text.subtext2);
      setPath(next, 'sidebar.collection.item.example.iconColor', text.subtext2);
      setPath(next, 'sidebar.dropdownIcon.color', text.subtext2);
      setPath(next, 'dropdown.iconColor', text.subtext2);
      setPath(next, 'requestTabPanel.url.icon', text.subtext2);
      setPath(next, 'requestTabs.example.iconColor', text.subtext2);
      setPath(next, 'table.thead.color', text.subtext2);
    }
    if (text.subtext1 !== undefined) {
      setPath(next, 'colors.text.subtext1', text.subtext1);
      setPath(next, 'colors.text.muted', text.subtext1);
      setPath(next, 'sidebar.muted', text.subtext1);
      setPath(next, 'requestTabPanel.responseStatus', text.subtext1);
      setPath(next, 'tabs.secondary.inactive.color', text.subtext1);
      setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.text', text.subtext1);
      if (!isLight) {
        // dark.js: caret uses SUBTEXT1 (light uses overlay)
        setPath(next, 'app.collection.toolbar.environmentSelector.caret', text.subtext1);
      }
    }
    if (text.subtext0 !== undefined) {
      setPath(next, 'colors.text.subtext0', text.subtext0);
      setPath(next, 'dropdown.mutedText', text.subtext0);
      setPath(next, 'requestTabs.icon.color', text.subtext0);
    }
  }

  if (textLink) {
    next.textLink = textLink;
  }

  if (draftColor) {
    next.draftColor = draftColor;
  }

  if (overlay) {
    next.overlay = { ...next.overlay, ...overlay };
    if (overlay.overlay2) {
      setPath(next, 'input.focusBorder', overlay.overlay2);
      setPath(next, 'modal.input.focusBorder', overlay.overlay2);
      setPath(next, 'dragAndDrop.border', overlay.overlay2);
    }
    if (overlay.overlay1) {
      setPath(next, 'input.placeholder.color', overlay.overlay1);
      setPath(next, 'codemirror.placeholder.color', overlay.overlay1);
      if (isLight) {
        setPath(next, 'app.collection.toolbar.environmentSelector.caret', overlay.overlay1);
        setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.hoverBorder', overlay.overlay1);
      }
    }
  }

  if (border) {
    next.border = { ...next.border, ...border };
    if (border.border2) {
      setPath(next, 'input.border', border.border2);
      setPath(next, 'modal.input.border', border.border2);
      setPath(next, 'sidebar.collection.item.focusBorder', border.border2);
      setPath(next, 'requestTabPanel.dragbar.activeBorder', border.border2);
      setPath(next, 'button2.color.secondary.border', border.border2);
      if (isLight) {
        setPath(next, 'app.collection.toolbar.environmentSelector.hoverBorder', border.border2);
        setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.border', border.border2);
      } else {
        // dark.js: env selector border/separator track GRAY_3 ≈ BORDER2
        setPath(next, 'app.collection.toolbar.environmentSelector.border', border.border2);
        setPath(next, 'app.collection.toolbar.environmentSelector.separator', border.border2);
        setPath(next, 'app.collection.toolbar.environmentSelector.noEnvironment.border', border.border2);
      }
    }
    if (border.border1) {
      setPath(next, 'sidebar.collection.item.indentBorder', border.border1);
      setPath(next, 'sidebar.collection.item.active.indentBorder', border.border1);
      setPath(next, 'dropdown.separator', border.border1);
      setPath(next, 'workspace.border', border.border1);
      setPath(next, 'requestTabPanel.card.border', border.border1);
      setPath(next, 'requestTabPanel.card.hr', border.border1);
      setPath(next, 'requestTabPanel.url.border', `solid 1px ${border.border1}`);
      if (isLight) {
        setPath(next, 'app.collection.toolbar.environmentSelector.border', border.border1);
        setPath(next, 'app.collection.toolbar.environmentSelector.separator', border.border1);
      } else {
        // dark.js: dropdown.border = BORDER1 (light keeps border: 'none')
        setPath(next, 'dropdown.border', border.border1);
      }
    }
    if (border.border0) {
      setPath(next, 'notifications.list.borderBottom', border.border0);
      setPath(next, 'requestTabs.bottomBorder', border.border0);
      setPath(next, 'table.border', border.border0);
      setPath(next, 'button.disabled.bg', border.border0);
      setPath(next, 'examples.border', border.border0);
      setPath(next, 'examples.urlBar.border', border.border0);
    }
  }

  if (intent) {
    next.status = { ...next.status };
    for (const key of ['info', 'success', 'warning', 'danger']) {
      if (!intent[key]) continue;
      const color = intent[key];
      next.status[key] = {
        background: rgba(color, 0.15),
        text: color,
        border: color
      };
    }
    if (intent.success) {
      setPath(next, 'colors.text.green', intent.success);
      setPath(next, 'button2.color.success.bg', intent.success);
      setPath(next, 'button2.color.success.border', intent.success);
      if (utility?.white) setPath(next, 'button2.color.success.text', utility.white);
    }
    if (intent.warning) {
      setPath(next, 'colors.text.warning', intent.warning);
      setPath(next, 'button2.color.warning.bg', intent.warning);
      setPath(next, 'button2.color.warning.border', intent.warning);
      if (utility?.white) setPath(next, 'button2.color.warning.text', utility.white);
    }
    if (intent.danger) {
      setPath(next, 'colors.text.danger', intent.danger);
      setPath(next, 'colors.bg.danger', intent.danger);
      setPath(next, 'button2.color.danger.bg', intent.danger);
      setPath(next, 'button2.color.danger.border', intent.danger);
      if (utility?.white) setPath(next, 'button2.color.danger.text', utility.white);
    }
  }

  if (hues) {
    if (hues.green) {
      setPath(next, 'request.methods.get', hues.green);
      setPath(next, 'requestTabPanel.responseOk', hues.green);
      setPath(next, 'codemirror.variable.valid', hues.green);
      setPath(next, 'app.collection.toolbar.sandboxMode.safeMode.color', hues.green);
      if (!intent?.success) {
        setPath(next, 'button2.color.success.bg', hues.green);
        setPath(next, 'button2.color.success.border', hues.green);
        setPath(next, 'colors.text.green', hues.green);
      }
    }
    if (hues.purple) {
      setPath(next, 'request.methods.post', hues.purple);
      setPath(next, 'request.methods.patch', hues.purple);
      setPath(next, 'colors.text.purple', hues.purple);
    }
    if (hues.orange) {
      setPath(next, 'request.methods.put', hues.orange);
      setPath(next, 'request.ws', hues.orange);
      if (!intent?.warning) {
        setPath(next, 'button2.color.warning.bg', hues.orange);
        setPath(next, 'button2.color.warning.border', hues.orange);
        setPath(next, 'colors.text.warning', hues.orange);
      }
    }
    if (hues.red) {
      setPath(next, 'request.methods.delete', hues.red);
      setPath(next, 'requestTabPanel.url.iconDanger', hues.red);
      setPath(next, 'requestTabPanel.responseError', hues.red);
      setPath(next, 'codemirror.variable.invalid', hues.red);
      setPath(next, 'colors.bg.danger', hues.red);
      if (!intent?.danger) {
        setPath(next, 'button2.color.danger.bg', hues.red);
        setPath(next, 'button2.color.danger.border', hues.red);
        setPath(next, 'colors.text.danger', hues.red);
      }
    }
    if (hues.teal) setPath(next, 'request.methods.options', hues.teal);
    if (hues.cyan) setPath(next, 'request.methods.head', hues.cyan);
    if (hues.indigo) setPath(next, 'request.grpc', hues.indigo);
    if (hues.pink) setPath(next, 'request.gql', hues.pink);
    if (hues.blue) {
      setPath(next, 'requestTabPanel.responsePending', hues.blue);
      setPath(next, 'codemirror.variable.prompt', hues.blue);
      if (!textLink) next.textLink = hues.blue;
    }
    if (hues.yellow) {
      setPath(next, 'colors.text.yellow', hues.yellow);
      setPath(next, 'app.collection.toolbar.sandboxMode.developerMode.color', hues.yellow);
    }
  }

  if (syntax && next.codemirror) {
    next.codemirror = {
      ...next.codemirror,
      tokens: {
        ...next.codemirror.tokens,
        ...syntax
      }
    };
  }

  return next;
};

export { normalizePalette };
export default applyPalette;
