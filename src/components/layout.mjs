import { readFileSync } from 'node:fs';
import { html, raw } from '../lib/html.mjs';
import { site, links, nav, ecosystemMenu, socials } from '../data/site.mjs';
import { products } from '../data/products.mjs';

export const mark = readFileSync(new URL('../assets/brand/hycyon-mark.svg', import.meta.url), 'utf8')
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '')
  .trim();

const markSvg = (cls = '') => html`<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true" fill="none">${raw(mark)}</svg>`;

// Runs before paint so the saved or system theme never flashes.
const themeInit = `try{var t=localStorage.getItem('hycyon-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')`;

const chevron = html`<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const header = () => html`
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="Hycyon — home">${markSvg()}<span>Hycyon</span></a>
    <nav class="nav" id="site-nav" aria-label="Primary">
      ${nav.map((n) => html`<a href="${n.href}">${n.label}</a>`)}
      <div class="eco">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="eco-panel">Ecosystem ${chevron}</button>
        <div class="eco-panel" id="eco-panel" hidden>
          ${ecosystemMenu.map(
            (g) => html`<div><h2>${g.group}</h2>${g.items.map((i) => html`<a href="${i.href}">${i.label}</a>`)}</div>`,
          )}
        </div>
      </div>
      <a class="btn btn-primary btn-sm" href="${links.startProject}">Start a Project</a>
    </nav>
    <div class="header-tools">
      <button class="icon-btn theme-btn" type="button" aria-label="Switch colour theme">
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
      </button>
      <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>`;

const footer = () => html`
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">${markSvg()}<span>Hycyon</span></a>
        <p>${site.tagline}</p>
      </div>
      <div><h2>Company</h2><ul>
        <li><a href="/#about">About</a></li>
        <li><a href="/#lab">Lab</a></li>
        <li><a href="${links.portfolio}">Portfolio</a></li>
      </ul></div>
      <div><h2>Products</h2><ul>
        ${products.filter((p) => p.status !== 'later').map((p) => html`<li><a href="${p.website ?? p.application}">${p.name}</a></li>`)}
      </ul></div>
      <div><h2>Services</h2><ul>
        <li><a href="${links.catalogue}">Service Catalogue</a></li>
        <li><a href="${links.startProject}">Start a Project</a></li>
      </ul></div>
      <div><h2>Connect</h2><ul>
        ${socials.map((s) => html`<li><a href="${s.href}" rel="noopener me">${s.name}</a></li>`)}
        <li><a href="mailto:${site.email}">${site.email}</a></li>
      </ul></div>
    </div>
    <div class="legal">
      <span>© ${new Date().getFullYear()} Hycyon · ${site.location}</span>
      <span><a href="/privacy/">Privacy</a></span>
    </div>
  </div>
</footer>`;

/** Full HTML document. `jsonLd` is optional structured data for the page. */
export const page = ({ title, description, path, body, jsonLd, noindex = false }) => html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${site.url}${path}">
${noindex ? html`<meta name="robots" content="noindex">` : ''}
<meta name="theme-color" content="${site.themeColor.light}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${site.themeColor.dark}" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hycyon">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${site.url}${path}">
<meta property="og:image" content="${site.url}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Hycyon — Technology, Products and Software">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${site.url}/assets/img/og.png">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/Fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script>${raw(themeInit)}</script>
${jsonLd ? html`<script type="application/ld+json">${raw(JSON.stringify(jsonLd))}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header()}
<main id="main">${body}</main>
${footer()}
<script src="/assets/main.js" defer></script>
</body>
</html>`;
