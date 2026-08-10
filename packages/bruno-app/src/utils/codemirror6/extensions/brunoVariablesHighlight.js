import { MatchDecorator, Decoration, ViewPlugin } from '@codemirror/view';
import get from 'lodash/get';
import { mockDataFunctions } from '@usebruno/common';
import { PROMPT_VARIABLE_TEXT_PATTERN } from '@usebruno/common/utils';

function pathFoundInVariables(path, obj) {
  return get(obj, path) !== undefined;
}

function createPlugin(variables, highlightPathParams) {
  const { pathParams = {}, ...rest } = variables || {};

  const variableDecorator = new MatchDecorator({
    regexp: /\{\{[^}]*\}\}/g,
    decoration: (match) => {
      const word = match[0].replace('{{', '').replace('}}', '').trim();
      if (PROMPT_VARIABLE_TEXT_PATTERN.test(word)) {
        return Decoration.mark({ class: 'cm-variable-prompt' });
      }
      const isMock = word.startsWith('$') && mockDataFunctions.hasOwnProperty(word.substring(1));
      const found = isMock || pathFoundInVariables(word, rest);
      return Decoration.mark({ class: found ? 'cm-variable-valid' : 'cm-variable-invalid' });
    }
  });

  const pathDecorator = highlightPathParams
    ? new MatchDecorator({
      regexp: /\/:[^/?&=\s]+/g,
      decoration: (match) => {
        const word = match[0].replace('/:', '').trim();
        const found = pathFoundInVariables(word, pathParams);
        return Decoration.mark({ class: found ? 'cm-variable-valid' : 'cm-variable-invalid' });
      }
    })
    : null;

  return ViewPlugin.fromClass(
    class {
      decorations;

      constructor(view) {
        this.decorations = variableDecorator.createDeco(view);
        if (pathDecorator) {
          const pathDeco = pathDecorator.createDeco(view);
          this.decorations = this.decorations.update({ add: pathDeco, sort: true });
        }
      }

      update(update) {
        this.decorations = variableDecorator.updateDeco(update, this.decorations);
        if (pathDecorator) {
          const pathDeco = pathDecorator.updateDeco(update, pathDecorator.createDeco(update.view));
          this.decorations = this.decorations.update({ add: pathDeco, sort: true });
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}

export function brunoVariablesHighlight(variables, { highlightPathParams = false } = {}) {
  return createPlugin(variables, highlightPathParams);
}
