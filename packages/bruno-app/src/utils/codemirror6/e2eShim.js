/**
 * Attach EditorView to the DOM for Playwright E2E tests.
 * Replaces the CM5 `el.CodeMirror` pattern with `el.__cmView`.
 */
export function attachE2eShim(view) {
  if (view?.dom) {
    view.dom.__cmView = view;
  }
}

export function detachE2eShim(view) {
  if (view?.dom) {
    delete view.dom.__cmView;
  }
}
