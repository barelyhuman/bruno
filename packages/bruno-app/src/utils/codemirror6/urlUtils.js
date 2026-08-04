const URL_TERMINATORS = /[\s"<>\\`]/;
const VALID_URL_CHARS = /^[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/;

export function extendUrlWithBalancedParentheses(url, line, endIndex) {
  let openParens = 0;
  for (const char of url) {
    if (char === '(') openParens++;
    else if (char === ')') openParens--;
  }
  if (openParens <= 0) return { url, lastIndex: endIndex };

  let extendedUrl = url;
  let i = endIndex;
  while (i < line.length) {
    const char = line[i];
    if (URL_TERMINATORS.test(char) || !VALID_URL_CHARS.test(char)) break;
    if (char === '(') openParens++;
    else if (char === ')') openParens--;
    if (openParens < 0) break;
    extendedUrl += char;
    i++;
  }
  return { url: extendedUrl, lastIndex: i };
}
