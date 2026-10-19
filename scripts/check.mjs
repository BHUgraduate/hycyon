// QA for the built site (run `npm run build` first). Exits non-zero on any failure.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { products, statusLabels } from '../src/data/products.mjs';
import { services } from '../src/data/services.mjs';
import { socials, links } from '../src/data/site.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const fail = (m) => errors.push(m);

// 1. Data models
for (const p of products) {
  if (!statusLabels[p.status]) fail(`product ${p.slug}: unknown status "${p.status}"`);
  if (!p.application?.startsWith('https://')) fail(`product ${p.slug}: application URL must be https`);
  if (p.website && !p.website.startsWith('https://')) fail(`product ${p.slug}: website URL must be https`);
  if (!p.features?.length) fail(`product ${p.slug}: needs features`);
}
for (const s of services) if (!s.catalogueLink.startsWith(links.catalogue)) fail(`service ${s.name}: must link to the catalogue`);
for (const s of socials) if (!s.href.startsWith('https://')) fail(`social ${s.name}: must be https`);

// 2. Pages
const pages = ['index.html', 'privacy/index.html', '404.html'];
const ids = (h) => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const f of pages) {
  const h = readFileSync(join(dist, f), 'utf8');
  const need = (cond, msg) => cond || fail(`${f}: ${msg}`);
  const title = h.match(/<title>([^<]+)/)?.[1] ?? '';
  need(title.length > 10 && title.length <= 70, `title length ${title.length}`);
  const desc = h.match(/name="description" content="([^"]*)/)?.[1] ?? '';
  need(desc.length >= 30 && desc.length <= 200, `description length ${desc.length}`);
  need(/rel="canonical" href="https:\/\/hycyon\.com/.test(h), 'canonical missing');
  for (const t of ['og:title', 'og:description', 'og:image', 'og:url']) need(h.includes(`property="${t}"`), `${t} missing`);
  need(h.includes('twitter:card'), 'twitter card missing');
  need((h.match(/<h1[\s>]/g) ?? []).length === 1, 'must have exactly one h1');
  need(/<html lang="en"/.test(h), 'lang missing');
  for (const m of h.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)) fail(`${f}: img without alt ${m[0]}`);
  // heading order
  let last = 0;
  for (const m of h.matchAll(/<h([1-6])[\s>]/g)) { const n = +m[1]; if (n > last + 1 && last) fail(`${f}: heading jumps h${last}→h${n}`); last = n; }
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(`${f}: invalid JSON-LD`); }
  }
  // internal links
  const own = ids(h);
  for (const m of h.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [path, hash] = href.split('#');
    if (!path && hash && !own.has(hash)) fail(`${f}: dead anchor #${hash}`);
    if (path) {
      const abs = path.startsWith('/') ? join(dist, path) : resolve(dirname(join(dist, f)), path);
      const target = path.endsWith('/') ? join(abs, 'index.html') : abs;
      if (!existsSync(target)) fail(`${f}: dead link ${href}`);
      else if (hash && !ids(readFileSync(target, 'utf8')).has(hash)) fail(`${f}: dead anchor ${href}`);
    }
  }
  if (f !== '404.html') for (const m of h.matchAll(/(?:src|href)="(\/[^"/][^"]*)"/g)) fail(`${f}: root-absolute URL ${m[1]} breaks sub-path hosting`);
}
for (const f of ['robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'CNAME', 'favicon.ico', 'assets/img/og.png']) if (!existsSync(join(dist, f))) fail(`missing ${f}`);

// 3. Honesty + secrets scan over source
const banned = [/trusted by/i, /\b\d+\+? (clients|customers|companies|users)\b/i, /testimonial/i, /award[- ]winning/i];
const secret = /(AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY)/;
const walk = (d) => readdirSync(d).flatMap((n) => (n === 'node_modules' || n === '.git' || n === 'dist' ? [] : statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
for (const f of walk(root)) {
  if (!/\.(mjs|js|css|md|json|yml|svg|html)$/.test(f) || f.endsWith('check.mjs') || f.endsWith('package-lock.json')) continue;
  const t = readFileSync(f, 'utf8');
  if (secret.test(t)) fail(`possible secret in ${f}`);
  if (f.includes('/src/') && !f.endsWith('.css')) for (const re of banned) if (re.test(t)) fail(`unverifiable claim /${re.source}/ in ${f}`);
}

if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log('All checks passed.');
