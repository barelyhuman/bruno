import { safeMarkdown } from './safeMarkdown';

describe('safeMarkdown', () => {
  it('renders http(s) links normally', () => {
    const html = safeMarkdown.render('[docs](https://example.com)');
    expect(html).toContain('href="https://example.com"');
  });

  it('neutralizes unsafe link hrefs at render time', () => {
    const html = safeMarkdown.render('[x](javascript:alert(1))');
    expect(html).not.toMatch(/href="javascript:/);
  });

  it('linkifies only safe auto-detected URLs', () => {
    const html = safeMarkdown.render('see https://example.com for details');
    expect(html).toContain('href="https://example.com"');
  });
});
