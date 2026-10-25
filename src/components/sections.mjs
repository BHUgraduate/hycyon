import { html } from '../lib/html.mjs';
import { links, founder, site } from '../data/site.mjs';
import { products, statusLabels } from '../data/products.mjs';
import { services } from '../data/services.mjs';
import { pillars, capabilities, labAreas, labEntries, labKinds, work } from '../data/content.mjs';
import { ecosystem } from './ecosystem.mjs';

const status = (s) => html`<span class="status ${s}">${statusLabels[s]}</span>`;

export const hero = (mark) => html`
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="reveal">
      <h1 id="hero-title">Technology for <em>ideas</em> worth building.</h1>
      <p class="hero-lede">Hycyon is a technology and product studio. We build websites, apps and AI software for clients, and products we make ourselves.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#build">Explore Hycyon</a>
        <a class="btn btn-ghost" href="${links.startProject}">Start a Project</a>
      </div>
      <p class="hero-meta">
        <span>Live today:</span>
        ${products.filter((p) => p.status === 'live').map((p) => html`<a href="${p.website ?? p.application}">${p.name}</a>`)}
      </p>
    </div>
    <div class="reveal">${ecosystem(mark)}</div>
  </div>
</section>`;

export const directions = () => html`
<section class="section" id="build" aria-labelledby="build-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">What Hycyon is</p>
      <h2 id="build-title">We build in two directions.</h2>
    </div>
    <div class="directions reveal">
      <div class="direction">
        <p class="tag">For the world</p>
        <h3>Software and digital experiences for clients.</h3>
        <p>Websites, applications and intelligent systems, built around what you actually need.</p>
        <a class="link-arrow" href="#services">See services</a>
      </div>
      <div class="direction">
        <p class="tag">For ourselves</p>
        <h3>Products, experiments and technology of our own.</h3>
        <p>Software we design, ship and maintain under the Hycyon name.</p>
        <a class="link-arrow" href="#products">See products</a>
      </div>
    </div>
  </div>
</section>`;

const productCard = (p) => html`
<article class="product reveal" id="product-${p.slug}">
  <div class="product-top">${status(p.status)}<span class="cat">${p.category}</span></div>
  <h3>${p.name}</h3>
  <p class="by">A Hycyon product · ${p.platforms.join(' · ')}</p>
  <p class="desc">${p.description}</p>
  <ul class="features">${p.features.map((f) => html`<li>${f}</li>`)}</ul>
  <div class="actions">
    ${p.website
      ? html`<a class="btn btn-primary btn-sm" href="${p.website}">Explore ${p.name}</a><a class="link-arrow" href="${p.application}">${p.applicationLabel ?? 'Open the app'}</a>`
      : html`<a class="btn btn-primary btn-sm" href="${p.application}">Explore ${p.name}</a>`}
  </div>
  <p class="note">${p.statusNote}</p>
</article>`;

export const productsSection = () => html`
<section class="section alt" id="products" aria-labelledby="products-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Products</p>
      <h2 id="products-title">Products by Hycyon</h2>
      <p>Software we designed, built and run ourselves. Every product shows its real status — nothing is listed as launched until it is.</p>
    </div>
    <div class="product-grid">
      ${products.map(productCard)}
      <article class="product later reveal" aria-label="Future products">
        <div class="product-top">${status('later')}</div>
        <h3>The next one</h3>
        <p>Hycyon is building continuously. New products appear here when they are real.</p>
      </article>
    </div>
  </div>
</section>`;

export const servicesSection = () => html`
<section class="section" id="services" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Services</p>
      <h2 id="services-title">Websites, apps and AI software for your business.</h2>
      <p>The same team that ships Hycyon's own products builds yours.</p>
    </div>
    <div class="service-list">
      ${services.map((s) => html`<div class="service reveal"><h3>${s.name}</h3><p>${s.description}</p></div>`)}
    </div>
    <div class="catalogue-band reveal">
      <div>
        <h3>Need something specific?</h3>
        <p>Explore the complete Hycyon catalogue to see services, deliverables, packages and pricing.</p>
      </div>
      <a class="btn btn-primary" href="${links.catalogue}">Open Catalogue</a>
    </div>
  </div>
</section>`;

export const workSection = () => html`
<section class="section" id="work" aria-labelledby="work-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Selected work</p>
      <h2 id="work-title">Built for clients, with the same care.</h2>
      <p>Each project is described by the problem it solved and what was built. Outcomes appear only when they are real.</p>
    </div>
    ${work.map(
      (w) => html`<article class="case reveal" id="work-${w.name.replace(/\W+/g, '')}">
        <div class="case-head">
          <div class="product-top">${status(w.status)}<span class="cat">${w.sector}</span></div>
          <h3>${w.name}</h3>
        </div>
        <dl class="case-body">
          <div><dt>The problem</dt><dd>${w.problem}</dd></div>
          <div><dt>The thinking</dt><dd>${w.approach}</dd></div>
          <div><dt>What was built</dt><dd><ul class="features">${w.built.map((b) => html`<li>${b}</li>`)}</ul></dd></div>
          <div><dt>What comes next</dt><dd>${w.next}</dd></div>
        </dl>
        <div class="founder-links"><a class="link-arrow" href="${w.caseStudy}">Read the case study</a>${w.href ? html`<a class="link-arrow" href="${w.href}">${w.hrefLabel}</a>` : ''}</div>
      </article>`,
    )}
  </div>
</section>`;

export const whySection = () => html`
<section class="section alt" id="why" aria-labelledby="why-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Why Hycyon</p>
      <h2 id="why-title">Client work, held to a product standard.</h2>
    </div>
    <div class="pillars">
      ${pillars.map((p) => html`<div class="pillar reveal"><h3>${p.title}</h3><p>${p.text}</p></div>`)}
    </div>
  </div>
</section>`;

export const engineeringSection = () => html`
<section class="section" id="engineering" aria-labelledby="eng-title">
  <div class="wrap split">
    <div class="bridge reveal">
      <p class="eyebrow">Engineering</p>
      <h2 id="eng-title">How we engineer: the technology under the hood.</h2>
      <p>Hycyon is built by engineers who don't stop at the interface. The engineering portfolio shows the projects, the code and the thinking behind them.</p>
      <a class="btn btn-ghost" href="${links.portfolio}">Explore the engineering portfolio</a>
    </div>
    <div class="reveal">
      <h3 class="sub-title">From interface to infrastructure.</h3>
      <dl class="caps">
        ${capabilities.map((c) => html`<div class="cap"><dt>${c.area}</dt><dd>${c.detail}</dd></div>`)}
      </dl>
    </div>
  </div>
</section>`;

export const labSection = () => html`
<section class="section alt" id="lab" aria-labelledby="lab-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">The Lab</p>
      <h2 id="lab-title">Exploring what's next.</h2>
      <p>Where unusual ideas live without being mistaken for commercial products.</p>
    </div>
    <ul class="lab-areas reveal" aria-label="Areas Hycyon explores">${labAreas.map((a) => html`<li>${a}</li>`)}</ul>
    ${labEntries.map(
      (e) => html`<article class="lab-entry reveal">
        <span class="kind">${e.kind}</span>
        <h3>${e.name}</h3>
        <p>${e.description}</p>
        <a class="link-arrow" href="${e.href}">${e.hrefLabel}</a>
      </article>`,
    )}
    <dl class="kind-legend reveal" aria-label="How Lab work is labelled">
      ${labKinds.map(([k, d]) => html`<div><dt>${k}</dt><dd>${d}</dd></div>`)}
    </dl>
  </div>
</section>`;

export const aboutSection = () => html`
<section class="section" id="about" aria-labelledby="about-title">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">About</p>
      <h2 id="about-title">Why Hycyon exists.</h2>
    </div>
    <div class="story reveal">
      <p>Technology is a tool for turning ideas into things people can actually use.</p>
      <p>Hycyon exists to build useful software, create products people return to, explore technology without a deadline, and solve real problems — whether they are ours or yours.</p>
      <p>Based in Varanasi, India, Hycyon is young and building continuously. What it has built so far is the proof: two live products and the engineering behind them.</p>
    </div>
    <div class="founder founder-wrap reveal">
      <div>
        <p class="eyebrow">The builder</p>
        <h2>${founder.name}</h2>
        <p class="role">${founder.role}</p>
      </div>
      <div>
        <p>Built by an engineer who cares about the details. Abhishek works across the stack — Flutter and Firebase, Swift on iOS, the web — and studies Sanskrit and Vedic literature alongside computer science.</p>
        <p>That intersection of language and computation produced VaakBoard, a native Sanskrit keyboard for iOS, and it shapes how Hycyon thinks about products: precise, unconventional where it matters, useful first.</p>
        <div class="founder-links">
          <a class="link-arrow" href="${links.portfolio}">Meet the builder</a>
          <a class="link-arrow" href="${founder.linkedin}" rel="noopener me">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

export const finalCta = () => html`
<section class="final" aria-labelledby="final-title">
  <div class="wrap reveal">
    <h2 id="final-title">Have something worth building?</h2>
    <p>Tell us what you're imagining. We'll help turn the idea into something real.</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="${links.startProject}">Start a Project</a>
      <a class="btn btn-ghost" href="mailto:${site.email}">${site.email}</a>
    </div>
  </div>
</section>`;
