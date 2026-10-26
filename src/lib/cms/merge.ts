/** Structural helpers for layering CMS overrides on top of the built-in copy. */

export type PlainObject = Record<string, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => (isPlainObject(node) ? node[key] : undefined), source);
}

/** Immutable set: returns a copy of `source` with `value` at `path`. */
export function setPath<T>(source: T, path: string, value: unknown): T {
  const [key, ...rest] = path.split('.');
  const node: PlainObject = isPlainObject(source) ? source : {};
  return { ...node, [key]: rest.length ? setPath(node[key], rest.join('.'), value) : value } as T;
}

/** An empty value with the same shape: '' for text, 0, false, [] for lists, and nested objects. */
export function blankLike<T>(template: T): T {
  if (typeof template === 'string') return '' as T;
  if (typeof template === 'number') return 0 as T;
  if (typeof template === 'boolean') return false as T;
  if (Array.isArray(template)) {
    // Rows of mixed cells (e.g. the package comparison table) keep one cell per column.
    return (template.some((cell) => typeof cell === 'boolean') ? template.map(() => false) : []) as T;
  }
  if (isPlainObject(template)) {
    return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, blankLike(value)])) as T;
  }
  return template;
}

/**
 * Layers `override` onto `base`, trusting only values whose type matches the base:
 * objects merge key by key (unknown keys are ignored), lists and text are replaced.
 * Malformed or stale data in the CMS therefore never breaks a page.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    const template = base[0];
    if (template === undefined) return override as T;
    if (isPlainObject(template)) {
      return override.filter(isPlainObject).map((item) => deepMerge(blankLike(template), item)) as T;
    }
    return override.filter((item) => ['string', 'number', 'boolean'].includes(typeof item)) as T;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const merged: PlainObject = { ...base };
    for (const key of Object.keys(base)) {
      if (key in override) merged[key] = deepMerge(base[key], override[key]);
    }
    return merged as T;
  }

  return (typeof override === typeof base ? override : base) as T;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}

/**
 * The parts of `value` that differ from `base`: changed text and numbers, and whole lists
 * that changed. Returns undefined when nothing differs, so untouched copy keeps following
 * the built-in defaults.
 */
export function diff(base: unknown, value: unknown): unknown {
  if (deepEqual(base, value)) return undefined;
  if (isPlainObject(base) && isPlainObject(value)) {
    const changes: PlainObject = {};
    for (const key of Object.keys(value)) {
      const change = diff(base[key], value[key]);
      if (change !== undefined) changes[key] = change;
    }
    return Object.keys(changes).length ? changes : undefined;
  }
  return value;
}
