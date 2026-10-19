// Static build: src/ → dist/. No dependencies.
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { toString } from './src/lib/html.mjs';
import { site } from './src/data/site.mjs';
import * as pages from './src/pages/pages.mjs';

const OUT = new URL('./dist/', import.meta.url);
const SRC = new URL('./src/', import.meta.url);
const write = (path, data) => {
  const url = new URL(path, OUT);
  mkdirSync(new URL('./', url), { recursive: true });
  writeFileSync(url, data);
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Pages
write('index.html', toString(pages.home()));
write('privacy/index.html', toString(pages.privacy()));
write('404.html', toString(pages.notFound()));

// CSS: tokens first, then base, then components.
const css = ['tokens', 'base', 'components']
  .map((n) => readFileSync(new URL(`assets/css/${n}.css`, SRC), 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\n\s*\n/g, '\n');
write('assets/site.css', css);

// Static assets
cpSync(new URL('assets/js/main.js', SRC), new URL('assets/main.js', OUT));
cpSync(new URL('assets/fonts', SRC), new URL('assets/fonts', OUT), { recursive: true });
if (existsSync(new URL('assets/img', SRC))) cpSync(new URL('assets/img', SRC), new URL('assets/img', OUT), { recursive: true });
if (existsSync(new URL('assets/img/favicon.ico', SRC))) cpSync(new URL('assets/img/favicon.ico', SRC), new URL('favicon.ico', OUT));

// Crawlers, manifest, hosting
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', '/privacy/']
    .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${site.updated}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
write(
  'manifest.webmanifest',
  JSON.stringify({
    name: 'Hycyon',
    short_name: 'Hycyon',
    description: site.description,
    start_url: './',
    display: 'browser',
    background_color: site.themeColor.light,
    theme_color: site.themeColor.light,
    icons: [
      { src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }),
);
write('CNAME', 'hycyon.com\n');
write('.nojekyll', '');
console.log('Built dist/');
