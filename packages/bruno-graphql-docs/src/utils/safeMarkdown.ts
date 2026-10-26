import MD from 'markdown-it';
import type MarkdownIt from 'markdown-it';
import { isSafeUrl } from '@usebruno/common/utils';

const defaultLinkOpen =
  (md: MarkdownIt): NonNullable<MarkdownIt['renderer']['rules']['link_open']> =>
  (tokens, idx, options, env, self) =>
    self.renderToken(tokens, idx, options);

export const createSafeMarkdownIt = (): MarkdownIt => {
  const md = new MD({
    html: false,
    // render urls as links, à la github-flavored markdown
    linkify: true
  });

  const renderLinkOpen = defaultLinkOpen(md);

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefIndex = tokens[idx].attrIndex('href');
    const attrs = tokens[idx].attrs;
    if (hrefIndex >= 0 && attrs) {
      const href = attrs[hrefIndex][1];
      if (!isSafeUrl(href)) {
        attrs[hrefIndex][1] = '#';
        tokens[idx].attrSet('aria-disabled', 'true');
        tokens[idx].attrSet('tabindex', '-1');
      }
    }

    return renderLinkOpen(tokens, idx, options, env, self);
  };

  return md;
};

export const safeMarkdown = createSafeMarkdownIt();
