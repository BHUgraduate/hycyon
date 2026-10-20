# Hycyon — hycyon.com

The official parent website of **Hycyon**: the brand-level front door to a technology and product ecosystem. It answers *what is Hycyon, what does it build, and where do I go next* — and then sends visitors to the site that owns each job.

## The ecosystem

Every site has exactly one purpose. This one never duplicates the others.

| Site | Role |
|---|---|
| **hycyon.com** (this repo) | Brand · vision · products · capabilities |
| [catalogue.hycyon.com](https://catalogue.hycyon.com/) | Services, packages, pricing, quote requests |
| [portfolio.hycyon.com](https://portfolio.hycyon.com/) | Founder and engineering work |
| [ebookpro.hycyon.com](https://ebookpro.hycyon.com/) | eBook Pro product website |
| [ebookpro.web.app](https://ebookpro.web.app/) | eBook Pro application |
| [brainsparkos.web.app](https://brainsparkos.web.app/) | BrainSpark application |

"Start a Project" is the single business CTA. It goes to the catalogue's quote section (`catalogue.hycyon.com/#quote`).

## Architecture

Zero runtime dependencies. A small Node (≥ 20) build turns data and template functions into static HTML; ~3 KB of vanilla JS handles theme, menus, reveals and the diagram.

```
build.mjs                 src/ → dist/ (pages, CSS bundle, assets, sitemap, robots, manifest, CNAME)
src/
  data/                   ← edit content here
    site.mjs              name, URLs, email, socials, nav, ecosystem menu
    products.mjs          products + status labels
    services.mjs          service summaries (link to the catalogue)
    content.mjs           pillars, capabilities, lab entries
    types.mjs             JSDoc models (Product, Service, LabEntry, Status)
  components/             layout (head/header/footer), sections, ecosystem diagram
  pages/pages.mjs         home, privacy, 404
  lib/                    html templating (auto-escaping), JSON-LD
  assets/
    css/                  tokens.css · base.css · components.css
    brand/hycyon-mark.svg the logo (single source for every raster asset)
    img/                  generated favicons, app icons, og.png (committed)
    fonts/                self-hosted Inter + Fraunces (SIL OFL)
    js/main.js
scripts/
  check.mjs               QA: data, metadata, headings, links/anchors, JSON-LD, secrets, unverifiable claims
  serve.mjs               local static server
  make-assets.mjs         regenerates favicons / icons / social image (needs Playwright)
```

### Adding a product
Append an object to `src/data/products.mjs` (`name, slug, category, status, statusNote, description, website, application, features, platforms, schemaCategory`). The grid is `auto-fit`, so a 4th or 10th product needs no template change. Statuses: `live · beta · development · experiment · later`. **Never mark something `live` unless it is.** Only `live` products are emitted as `SoftwareApplication` structured data.

### Adding a service / lab entry
`src/data/services.mjs` and `labEntries` in `src/data/content.mjs`.

## Development

```
npm run build      # generate dist/
npm run check      # QA — must print "All checks passed."
npm test           # build + check (what CI runs)
npm run serve      # http://localhost:4173 (serves dist/)
npm run assets     # regenerate raster brand assets from the SVG mark
```

No environment variables or secrets are required. Nothing in this repo is a credential; `check.mjs` scans for common key patterns.

## Design system

Tokens live in `src/assets/css/tokens.css` and are written to be copied into future Hycyon sites unchanged: colour (light + dark), type scale (Fraunces display, Inter body), 4px spacing scale, radius, borders, shadows, motion, and breakpoints (480 / 768 / 1024 / 1280 / 1600, documented in the file because CSS can't use variables in media queries).

- **Light:** warm paper, ink, one signal colour (halcyon teal). **Dark:** near-black, not inverted — its own signal and amber values.
- Theme follows the system until the visitor toggles; the choice is stored in `localStorage` only.
- Motion is limited to section reveals, flowing orbit lines and diagram hover; all of it is disabled under `prefers-reduced-motion`.
- Cross-page navigation uses CSS view transitions where supported.

## SEO

Canonical URL, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD (`Organization`, `WebSite`, `SoftwareApplication` per live product). The 1200×630 social image is `src/assets/img/og.png`.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (build → `npm test` → deploy `dist/`). One-time setup:

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Custom domain `hycyon.com` (the build emits `CNAME`); DNS A/AAAA records to GitHub Pages, then enable *Enforce HTTPS*.

## Content rule

Only claims supported by shipped work appear here: no invented clients, testimonials, statistics or "trusted by" logos. Product features were checked against the eBook Pro and BrainSpark repositories; the QA script blocks common unverifiable phrases.
