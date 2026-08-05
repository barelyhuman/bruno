import { posToLineCh } from './posUtils';

const MAX_MATCHES = 99_999;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds all matches in the CM6 document for the given search parameters.
 *
 * @param {import('@codemirror/view').EditorView} view
 * @param {string}  searchText
 * @param {boolean} regex
 * @param {boolean} caseSensitive
 * @param {boolean} wholeWord
 * @param {number}  [limit]
 * @returns {Array<{ from: {line, ch}, to: {line, ch} }>}
 */
export function findSearchMatches(view, searchText, regex, caseSensitive, wholeWord, limit = MAX_MATCHES) {
  try {
    if (!view || !searchText) return [];

    let query;
    if (regex) {
      try {
        query = new RegExp(searchText, caseSensitive ? 'g' : 'gi');
      } catch (error) {
        console.warn('Invalid regex provided in search!', error);
        return [];
      }
    } else if (wholeWord) {
      const escaped = escapeRegExp(searchText);
      query = new RegExp(`\\b${escaped}\\b`, caseSensitive ? 'g' : 'gi');
    } else {
      query = new RegExp(escapeRegExp(searchText), caseSensitive ? 'g' : 'gi');
    }

    const doc = view.state.doc;
    const text = doc.toString();
    const out = [];
    let match;
    while ((match = query.exec(text)) !== null) {
      if (match[0].length === 0) {
        // Avoid infinite loop on zero-width matches
        if (query.lastIndex === match.index) query.lastIndex += 1;
        continue;
      }
      const from = match.index;
      const to = from + match[0].length;
      out.push({ from: posToLineCh(doc, from), to: posToLineCh(doc, to) });
      if (out.length >= limit) break;
    }
    return out;
  } catch (e) {
    console.error('Search error:', e);
    return [];
  }
}

/**
 * @param {number}  docVersion
 * @param {string}  searchText
 * @param {boolean} regex
 * @param {boolean} caseSensitive
 * @param {boolean} wholeWord
 */
export function createCacheKey(docVersion, searchText, regex, caseSensitive, wholeWord) {
  return `${docVersion}⇴${searchText}⇴${regex}⇴${caseSensitive}⇴${wholeWord}`;
}
