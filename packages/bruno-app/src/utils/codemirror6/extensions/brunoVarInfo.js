import { hoverTooltip, EditorView } from '@codemirror/view';
import { extractVariableInfo, renderVarInfo } from 'utils/codemirror/brunoVarInfo';

const VAR_RE = /\{\{[^}]*\}\}/g;

function findVarAt(doc, pos) {
  const line = doc.lineAt(pos);
  let match;
  VAR_RE.lastIndex = 0;
  while ((match = VAR_RE.exec(line.text)) !== null) {
    const from = line.from + match.index;
    const to = from + match[0].length;
    if (pos >= from && pos <= to) {
      return { from, to, string: match[0] };
    }
  }
  return null;
}

/**
 * CM6 hover tooltip reusing the existing CM5 brunoVarInfo DOM renderer.
 * @param {() => { variables: object, collection?: object, item?: object }} getOptions
 */
export function brunoVarInfo(getOptions) {
  return [
    hoverTooltip(
      (view, pos) => {
        const found = findVarAt(view.state.doc, pos);
        if (!found) return null;

        const options = getOptions() || {};
        const { variableName } = extractVariableInfo(found.string, options.variables);
        if (!variableName?.trim()) return null;

        return {
          pos: found.from,
          end: found.to,
          above: true,
          create() {
            const wrap = document.createElement('div');
            // Reuse CM5 popup styles; cm6-bruno-var-info overrides fixed/opacity:0
            wrap.className = 'CodeMirror-brunoVarInfo cm6-bruno-var-info';
            wrap.setAttribute('data-testid', 'var-info-popup');
            const node = renderVarInfo({ string: found.string }, getOptions() || {});
            if (node) wrap.appendChild(node);
            return { dom: wrap };
          }
        };
      },
      { hoverTime: 300 }
    ),
    EditorView.theme({
      '.cm-tooltip:has(> .cm6-bruno-var-info)': {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',
        boxShadow: 'none'
      },
      '.cm6-bruno-var-info': {
        position: 'static !important',
        opacity: '1 !important',
        top: 'auto !important',
        left: 'auto !important'
      }
    })
  ];
}
