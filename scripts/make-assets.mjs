// Regenerates raster brand assets (favicons, app icons, 1200×630 social image)
// from src/assets/brand/hycyon-mark.svg. Needs Playwright + Chromium (dev-only; outputs are committed).
//   npx playwright install chromium && node scripts/make-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const out = new URL('../src/assets/img/', import.meta.url);
mkdirSync(out, { recursive: true });
const inner = readFileSync(new URL('../src/assets/brand/hycyon-mark.svg', import.meta.url), 'utf8')
  .replace(/<svg[^>]*>/, '').replace('</svg>', '');
const mark = (color, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" style="color:${color}">${inner}</svg>`;

// SVG favicon follows the visitor's colour scheme.
writeFileSync(new URL('favicon.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>:root{color:#10141a}@media(prefers-color-scheme:dark){:root{color:#eef1f4}}</style>${inner}</svg>`);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const shot = async (html, w, h, file, transparent = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<style>html,body{margin:0}</style>${html}`);
  const buf = await page.screenshot({ omitBackground: transparent });
  await page.close();
  if (file) writeFileSync(new URL(file, out), buf);
  return buf;
};
const tile = (size, bg, fg, pad) => `<div style="width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center">${mark(fg, size - pad * 2)}</div>`;

await shot(tile(180, '#f5f3ee', '#10141a', 30), 180, 180, 'apple-touch-icon.png');
await shot(tile(192, '#f5f3ee', '#10141a', 30), 192, 192, 'icon-192.png');
await shot(tile(512, '#f5f3ee', '#10141a', 80), 512, 512, 'icon-512.png');
// Favicon: no padding, no text — legible at 16px.
const f16 = await shot(`<div style="width:16px;height:16px">${mark('#10141a', 16)}</div>`, 16, 16, 'favicon-16.png', true);
const f32 = await shot(`<div style="width:32px;height:32px">${mark('#10141a', 32)}</div>`, 32, 32, 'favicon-32.png', true);

// ICO container holding the two PNGs.
const ico = (pngs) => {
  const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const dirs = pngs.map(([size, buf]) => {
    const d = Buffer.alloc(16);
    d[0] = size; d[1] = size; d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6);
    d.writeUInt32LE(buf.length, 8); d.writeUInt32LE(offset, 12); offset += buf.length; return d;
  });
  return Buffer.concat([head, ...dirs, ...pngs.map(([, b]) => b)]);
};
writeFileSync(new URL('favicon.ico', out), ico([[16, f16], [32, f32]]));

// Social preview
await shot(`
<div style="width:1200px;height:630px;background:#0b0e12;color:#eef1f4;font-family:Georgia,serif;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(700px 420px at 82% 20%,rgba(79,214,200,.16),transparent 65%)"></div>
  <svg style="position:absolute;right:-60px;top:30px" width="640" height="640" viewBox="0 0 640 640" fill="none" stroke="#38424f" stroke-width="1.5">
    <circle cx="320" cy="320" r="150"/><circle cx="320" cy="320" r="250" stroke-dasharray="2 9" stroke-linecap="round"/>
    <circle cx="190" cy="245" r="9" fill="#4fd6c8" stroke="none"/><circle cx="450" cy="245" r="9" fill="#4fd6c8" stroke="none"/>
    <circle cx="320" cy="70" r="7" fill="#eef1f4" stroke="none"/><circle cx="537" cy="445" r="7" fill="#eef1f4" stroke="none"/><circle cx="103" cy="445" r="7" fill="#eef1f4" stroke="none"/>
    <circle cx="320" cy="320" r="62" fill="#10151b" stroke="#eef1f4"/>
  </svg>
  <div style="position:absolute;left:84px;top:84px;display:flex;align-items:center;gap:20px">${mark('#eef1f4', 64)}<span style="font-size:44px;letter-spacing:-1px">Hycyon</span></div>
  <div style="position:absolute;left:84px;bottom:96px;max-width:700px">
    <div style="font-size:84px;line-height:1.02;letter-spacing:-3px">Technology for ideas worth building.</div>
    <div style="margin-top:28px;font:600 24px system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#4fd6c8">Technology · Products · Software</div>
  </div>
</div>`, 1200, 630, 'og.png');
await browser.close();
console.log('Wrote brand assets to src/assets/img/');
