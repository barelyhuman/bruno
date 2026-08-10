/**
 * Deep-merge source into target. Plain objects recurse; arrays and primitives replace.
 * Does not mutate inputs.
 */
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (target, source) => {
  if (!isPlainObject(source)) {
    return source;
  }

  const result = isPlainObject(target) ? { ...target } : {};

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    if (isPlainObject(sourceValue) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], sourceValue);
    } else if (isPlainObject(sourceValue)) {
      result[key] = deepMerge({}, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
};

export default deepMerge;
