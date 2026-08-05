const { describe, it, expect } = require('@jest/globals');
const { Text } = require('@codemirror/state');

import { getLanguageSupport, isYamlMode } from './languages';
import { yamlDiagnostics } from './extensions/yamlLint';

describe('codemirror6 languages', () => {
  it('recognizes yaml modes', () => {
    expect(isYamlMode('yaml')).toBe(true);
    expect(isYamlMode('application/yaml')).toBe(true);
    expect(isYamlMode('javascript')).toBe(false);
  });

  it('returns language support for yaml modes', () => {
    expect(getLanguageSupport('yaml').length).toBeGreaterThan(0);
    expect(getLanguageSupport('application/yaml').length).toBeGreaterThan(0);
  });
});

describe('yamlDiagnostics', () => {
  it('returns no diagnostics for valid yaml', () => {
    const doc = Text.of(['openapi: 3.0.0', 'info:', '  title: test']);
    const text = doc.toString();
    expect(yamlDiagnostics(doc, text)).toEqual([]);
  });

  it('returns no diagnostics for empty content', () => {
    const doc = Text.of(['']);
    expect(yamlDiagnostics(doc, '')).toEqual([]);
  });

  it('returns a diagnostic for bad indentation', () => {
    const text = 'foo: bar\n  bad: indent';
    const doc = Text.of(text.split('\n'));
    const diagnostics = yamlDiagnostics(doc, text);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe('error');
    expect(diagnostics[0].message).toMatch(/bad indentation/i);
    expect(diagnostics[0].from).toBeLessThan(diagnostics[0].to);
  });
});
