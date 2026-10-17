// Tiny HTML templating: interpolated values are escaped unless wrapped in raw().
const RAW = Symbol('raw');

export const raw = (s) => ({ [RAW]: true, value: String(s) });

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const render = (v) => {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(render).join('');
  if (typeof v === 'object' && v[RAW]) return v.value;
  return esc(v);
};

/** Tagged template returning a raw (already-safe) fragment. */
export const html = (strings, ...values) =>
  raw(strings.reduce((out, s, i) => out + s + (i < values.length ? render(values[i]) : ''), ''));

export const toString = (fragment) => render(fragment);
