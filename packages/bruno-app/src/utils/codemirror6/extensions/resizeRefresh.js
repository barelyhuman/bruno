/**
 * Refreshes a CM6 editor when its container size changes.
 */
export const setupCodeMirrorResizeRefresh = (view, element) => {
  if (!view || !element || typeof ResizeObserver === 'undefined') {
    return () => {};
  }

  let frameId = null;
  const observer = new ResizeObserver(() => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      view.requestMeasure();
      frameId = null;
    });
  });

  observer.observe(element);
  return () => {
    observer.disconnect();
    if (frameId) cancelAnimationFrame(frameId);
  };
};
