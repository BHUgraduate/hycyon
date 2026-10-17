import { html, raw } from '../lib/html.mjs';

// The hero visual: Hycyon at the centre, products on the inner orbit,
// the three other branches (services, engineering, lab) on the outer orbit.
const C = 320;
const polar = (r, deg) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];

const nodes = [
  { id: 'ebook', label: 'eBook Pro', sub: 'Live', r: 150, deg: 300, href: '#products', aria: 'eBook Pro, a Hycyon product' },
  { id: 'brainspark', label: 'BrainSpark', sub: 'Live', r: 150, deg: 60, href: '#products', aria: 'BrainSpark, a Hycyon product' },
  { id: 'future', label: 'Next product', sub: 'Coming later', r: 150, deg: 180, href: '#products', aria: 'Future Hycyon products', later: true },
  { id: 'lab', label: 'Lab', sub: 'Experiments', r: 250, deg: 0, href: '#lab', aria: 'The Hycyon Lab' },
  { id: 'services', label: 'Services', sub: 'Catalogue', r: 250, deg: 120, href: '#services', aria: 'Hycyon services' },
  { id: 'engineering', label: 'Engineering', sub: 'Portfolio', r: 250, deg: 240, href: '#engineering', aria: 'Hycyon engineering' },
];

const W = 150;
const H = 62;

const node = (n) => {
  const [x, y] = polar(n.r, n.deg);
  return html`<g class="eco-node${n.later ? ' later' : ''}" data-node="${n.id}">
    <a href="${n.href}" aria-label="${n.aria}">
      <rect x="${x - W / 2}" y="${y - H / 2}" width="${W}" height="${H}" rx="31"/>
      <text x="${x}" y="${y - 8}">${n.label}</text>
      <text class="sub" x="${x}" y="${y + 14}">${n.sub}</text>
    </a>
  </g>`;
};

const spoke = (n) => {
  const [x, y] = polar(n.r, n.deg);
  return html`<line class="eco-spoke" data-spoke="${n.id}" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`;
};

const orbit = (r) => `M ${C - r} ${C} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0`;

export const ecosystem = (mark) => html`
<figure class="ecosystem" aria-labelledby="eco-caption">
  <svg viewBox="0 0 640 640" role="group" aria-label="Diagram of the Hycyon ecosystem">
    <circle class="eco-ring" cx="${C}" cy="${C}" r="150"/>
    <circle class="eco-ring dash" cx="${C}" cy="${C}" r="250"/>
    <circle class="eco-ring dash rev" cx="${C}" cy="${C}" r="205" opacity=".5"/>
    ${nodes.map(spoke)}
    <circle class="eco-packet" r="4"><animateMotion dur="14s" repeatCount="indefinite" path="${orbit(150)}"/></circle>
    <circle class="eco-packet" r="4"><animateMotion dur="26s" repeatCount="indefinite" path="${orbit(250)}" keyPoints="1;0" keyTimes="0;1" calcMode="linear"/></circle>
    <g class="eco-core">
      <circle class="pulse" cx="${C}" cy="${C}" r="62"/>
      <circle cx="${C}" cy="${C}" r="62"/>
      <g transform="translate(${C - 24} ${C - 24}) scale(.75)" aria-hidden="true">${raw(mark)}</g>
    </g>
    ${nodes.map(node)}
  </svg>
  <figcaption id="eco-caption" class="sr-only">Hycyon sits at the centre. Products — eBook Pro and BrainSpark — orbit closest. Services, Engineering and the Lab form the outer orbit.</figcaption>
</figure>`;
