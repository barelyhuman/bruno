import { isSafeUrl } from 'utils/url/index';

export const handleSafeMarkdownLinkClick = (event) => {
  const target = event.target.closest('a');
  if (!target) {
    return;
  }

  event.preventDefault();

  const href = target.getAttribute('href');
  if (!href || !isSafeUrl(href)) {
    return;
  }

  if (window?.ipcRenderer?.openExternal) {
    window.ipcRenderer.openExternal(href);
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
};
