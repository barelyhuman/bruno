import MD from 'markdown-it';
import { isSafeUrl } from 'utils/url/index';

const defaultLinkOpen = (md) => (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);

export const createSafeMarkdownIt = () => {
  const md = new MD({
    html: false,
    linkify: true
  });

  const renderLinkOpen = defaultLinkOpen(md);

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex >= 0 && tokens[idx].attrs) {
      const href = tokens[idx].attrs[hrefIndex][1];
      if (!isSafeUrl(href)) {
        tokens[idx].attrs[hrefIndex][1] = '#';
        tokens[idx].attrSet('aria-disabled', 'true');
        tokens[idx].attrSet('tabindex', '-1');
      }
    }

    return renderLinkOpen(tokens, idx, options, env, self);
  };

  return md;
};

export const safeMarkdown = createSafeMarkdownIt();
