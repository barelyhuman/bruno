import React, { useRef } from 'react';
import { rgba } from 'polished';
import { useTheme } from 'providers/Theme';
import { getLightThemes, getDarkThemes } from 'themes/index';
import { IconBrightnessUp, IconMoon, IconDeviceDesktop, IconUpload, IconTrash, IconDownload } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';

const ThemePreview = ({ themeId, isDark, themesMap }) => {
  const theme = themesMap[themeId] || themesMap[isDark ? 'dark' : 'light'];

  const bgColor = theme.background.base;
  const sidebarColor = theme.sidebar.bg;
  const lineColor = rgba(theme.brand, 0.5);

  return (
    <div className="theme-preview" style={{ background: bgColor, border: `1px solid ${lineColor}` }}>
      <div className="theme-preview-sidebar" style={{ background: sidebarColor }} />
      <div className="theme-preview-main">
        <div className="theme-preview-line" style={{ background: lineColor }} />
        <div className="theme-preview-line" style={{ background: lineColor, width: '60%' }} />
        <div className="theme-preview-line" style={{ background: lineColor, width: '70%' }} />
      </div>
    </div>
  );
};

const ThemeVariantCard = ({ theme, isSelected, onClick, onDelete, onExport, themesMap }) => {
  const isDark = theme.mode === 'dark';
  const isCustom = Boolean(theme.custom);

  return (
    <div className={`theme-variant-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <ThemePreview themeId={theme.id} isDark={isDark} themesMap={themesMap} />
      <span className="theme-variant-name">
        {theme.name}
        {isCustom && <span className="theme-custom-badge">Custom</span>}
      </span>
      {isCustom && (
        <div className="theme-variant-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="theme-action-btn"
            title="Export theme"
            onClick={() => onExport(theme.id)}
          >
            <IconDownload size={14} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="theme-action-btn danger"
            title="Remove theme"
            onClick={() => {
              if (window.confirm(`Remove custom theme "${theme.name}"?`)) {
                onDelete(theme.id);
              }
            }}
          >
            <IconTrash size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
};

const Themes = () => {
  const {
    storedTheme,
    setStoredTheme,
    themeVariantLight,
    setThemeVariantLight,
    themeVariantDark,
    setThemeVariantDark,
    allThemes,
    customThemesRegistry,
    importCustomTheme,
    removeCustomTheme,
    exportCustomTheme
  } = useTheme();

  const fileInputRef = useRef(null);

  const lightThemes = getLightThemes(customThemesRegistry);
  const darkThemes = getDarkThemes(customThemesRegistry);

  const themeModes = [
    { key: 'light', label: 'Light', icon: IconBrightnessUp },
    { key: 'dark', label: 'Dark', icon: IconMoon },
    { key: 'system', label: 'System', icon: IconDeviceDesktop }
  ];

  const handleModeChange = (mode) => {
    setStoredTheme(mode);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await importCustomTheme(file);
  };

  const renderThemeVariants = (themeList, selectedVariant, onSelect, label) => (
    <div className="theme-variant-section">
      <div className="theme-variant-label">{label}</div>
      <div className="theme-variants">
        {themeList.map((theme) => (
          <ThemeVariantCard
            key={theme.id}
            theme={theme}
            isSelected={selectedVariant === theme.id}
            onClick={() => onSelect(theme.id)}
            onDelete={removeCustomTheme}
            onExport={exportCustomTheme}
            themesMap={allThemes}
          />
        ))}
      </div>
    </div>
  );

  return (
    <StyledWrapper>
      <div className="flex flex-col gap-4 w-full appearance-container">
        <div className="flex items-center justify-between gap-3">
          <div className="section-header">Appearance</div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.yml,.yaml,application/json,text/yaml,text/x-yaml"
              className="hidden"
              onChange={handleFileChange}
            />
            <button type="button" className="import-theme-btn" onClick={handleImportClick}>
              <IconUpload size={14} strokeWidth={1.5} />
              Import theme
            </button>
          </div>
        </div>

        <div className="flex gap-3 theme-mode-selector justify-start">
          {themeModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = storedTheme === mode.key;

            return (
              <button
                key={mode.key}
                onClick={() => handleModeChange(mode.key)}
                className={`theme-mode-option relative ${isSelected ? 'selected' : ''}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{mode.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="section-divider" />

        {storedTheme === 'light' && (
          <>
            {renderThemeVariants(lightThemes, themeVariantLight, setThemeVariantLight, 'Light Theme')}
          </>
        )}

        {storedTheme === 'dark' && (
          <>
            {renderThemeVariants(darkThemes, themeVariantDark, setThemeVariantDark, 'Dark Theme')}
          </>
        )}

        {storedTheme === 'system' && (
          <>
            {renderThemeVariants(lightThemes, themeVariantLight, setThemeVariantLight, 'Light Theme')}
            <div className="section-divider" />
            {renderThemeVariants(darkThemes, themeVariantDark, setThemeVariantDark, 'Dark Theme')}
          </>
        )}
      </div>
    </StyledWrapper>
  );
};

export default Themes;
