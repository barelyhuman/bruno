import { StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';

/** @type {import('@codemirror/state').StateEffectType<import('@codemirror/view').DecorationSet>} */
export const setSearchMarksEffect = StateEffect.define();

/**
 * Holds viewport search-match decorations for the Bruno CM6 search bar.
 */
export const searchMarksField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setSearchMarksEffect)) {
        deco = effect.value;
      }
    }
    return deco;
  },
  provide: (field) => EditorView.decorations.from(field)
});

export const searchMarksExtension = searchMarksField;
