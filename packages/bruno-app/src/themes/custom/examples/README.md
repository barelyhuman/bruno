# Custom theme file formats
#
# 1) Palette + base (recommended)
#    - Set `base` to a built-in id (dark, nord, light, …) OR set `mode` to light|dark.
#      Only one is required; base implies mode, mode alone uses that light/dark built-in.
#    - `palette` mirrors the built-in authoring palette:
#        primary, hues, background, text, overlay, border, utility, system
#      Optional: intent, syntax (derived from hues/text when omitted), textLink, draftColor
#    - Hues drive request method colors, status/intent defaults, CodeMirror variable colors, etc.
#    - Optional `overrides` for any full theme token path.
#    See palette-overlay.yml
#
# 2) Full / partial theme
#    - Omit `palette`. Provide `theme: { … }` or top-level tokens, optionally with `base`.
#    - Without `base`, the document must be a complete schema-valid theme (include mode).
#    See full-theme.json
#
# Built-in base ids: light, dark, light-monochrome, light-pastel, dark-monochrome,
# dark-pastel, catppuccin-latte, catppuccin-frappe, catppuccin-macchiato,
# catppuccin-mocha, nord, vscode-light, vscode-dark
