import type { MouseEvent } from 'react';
import { isSafeUrl } from '@usebruno/common/utils';

export const handleSafeMarkdownLinkClick = (event: MouseEvent<HTMLElement>) => {
  const target = (event.target as HTMLElement | null)?.closest('a');
  if (!target) {
    return;
  }

  // Always prevent the anchor's default navigation — falling through to it
  // for a link that fails the safety check would navigate the renderer itself.
  event.preventDefault();

  const href = target.getAttribute('href');
  if (!href || !isSafeUrl(href)) {
    return;
  }

  const external = (window as Window & { ipcRenderer?: { openExternal?: (url: string) => void } }).ipcRenderer
    ?.openExternal;
  if (external) {
    external(href);
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
};
