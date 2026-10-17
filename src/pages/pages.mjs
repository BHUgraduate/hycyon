import { html } from '../lib/html.mjs';
import { site, links } from '../data/site.mjs';
import { homeJsonLd } from '../lib/seo.mjs';
import { page, mark } from '../components/layout.mjs';
import * as s from '../components/sections.mjs';

export const home = () =>
  page({
    title: site.title,
    description: site.description,
    path: '/',
    jsonLd: homeJsonLd(),
    body: html`${s.hero(mark)}${s.directions()}${s.productsSection()}${s.servicesSection()}${s.whySection()}${s.engineeringSection()}${s.labSection()}${s.aboutSection()}${s.finalCta()}`,
  });

export const privacy = () =>
  page({
    title: 'Privacy — Hycyon',
    description: 'What hycyon.com does and does not collect.',
    path: '/privacy/',
    body: html`<div class="wrap"><article class="prose">
      <h1>Privacy</h1>
      <p>Last updated ${site.updated}.</p>
      <h2>This website</h2>
      <p>hycyon.com does not use analytics, advertising trackers or cookies, and it has no accounts or forms. Fonts are served from this site, not a third party.</p>
      <p>Your browser may store one preference in local storage — whether you chose the light or dark theme. It never leaves your device.</p>
      <h2>Contacting us</h2>
      <p>If you email <a href="mailto:${site.email}">${site.email}</a>, we use your message only to reply to it. The project request form lives on the <a href="${links.catalogue}">Hycyon catalogue</a>.</p>
      <h2>Our products</h2>
      <p>Each Hycyon product has its own privacy policy. eBook Pro's is at <a href="${links.ebookProSite}privacy/">ebookpro.hycyon.com/privacy</a>.</p>
      <h2>Questions</h2>
      <p>Write to <a href="mailto:${site.email}">${site.email}</a>.</p>
    </article></div>`,
  });

export const notFound = () =>
  page({
    title: 'Page not found — Hycyon',
    description: 'This page does not exist on hycyon.com. Head back to the Hycyon home page.',
    path: '/404.html',
    noindex: true,
    body: html`<div class="wrap"><article class="prose">
      <h1>That page isn't here.</h1>
      <p>It may have moved, or the link may be wrong.</p>
      <p><a class="btn btn-primary" href="/">Back to Hycyon</a></p>
    </article></div>`,
  });
