// Editorial content that is not a product or a service.

export const pillars = [
  {
    title: 'Build and product',
    text: 'Hycyon does not only build for clients. It ships its own products, so client work is held to a product standard.',
  },
  {
    title: 'Engineering and design',
    text: 'Technology and the experience of using it are decided together, not handed from one team to the next.',
  },
  {
    title: 'Product thinking',
    text: 'The goal is not to deliver code. The goal is to build something useful to the person using it.',
  },
  {
    title: 'Technical depth',
    text: 'Web, mobile, backend, on-device machine learning and AI — within one codebase and one team.',
  },
  {
    title: 'Continuous experimentation',
    text: 'Products evolve through experiments, and the experiments are allowed to be unusual.',
  },
];

// Drawn from the actual repositories (eBook Pro, BrainSpark, VaakBoard, Catalogue, Portfolio).
export const capabilities = [
  { area: 'Web', detail: 'Static-first sites and web apps, Tailwind and vanilla HTML/CSS/JS, zero-dependency builds.' },
  { area: 'Mobile', detail: 'Flutter and Dart apps for Android and iOS, with offline-first libraries and local notifications.' },
  { area: 'Backend', detail: 'Node.js on Firebase Cloud Functions (2nd gen), callable APIs, Firebase Auth.' },
  { area: 'AI', detail: 'Google Gemini behind a serverless proxy, retrieval-style summaries, AI tutoring flows.' },
  { area: 'Data', detail: 'Firestore with security rules and indexes, conflict-preserving sync across devices.' },
  { area: 'Infrastructure', detail: 'Firebase Hosting, GitHub Pages, Google Cloud Secret Manager for credentials.' },
  { area: 'Native', detail: 'Swift, SwiftUI and CoreData on iOS, including a custom keyboard extension.' },
  { area: 'Product architecture', detail: 'On-device OCR and translation with Google ML Kit, spaced-repetition scheduling, a single source of truth per product.' },
];

export const labAreas = [
  'Artificial intelligence',
  'Language technology',
  'Education',
  'Productivity',
  'Developer tools',
  'Experimental interfaces',
];

/** @type {import('./types.mjs').LabEntry[]} */
export const labEntries = [
  {
    name: 'Sanskrit input engine',
    kind: 'Prototype',
    description:
      'The language engine behind VaakBoard: Latin and IAST to Devanāgarī and back, covered by an automated test suite and running in a web demo. Language detection, suggestions and correction are not built yet — the roadmap says so.',
    href: 'https://portfolio.hycyon.com/sanskrit-keyboard.html',
    hrefLabel: 'Try the demo',
  },
];

/** Client work. Describe the problem and what was built; add outcomes only when they are real. */
export const work = [
  {
    name: "iron's irony",
    status: 'client',
    sector: 'Architectural & decorative ironwork',
    problem:
      'A fabricator whose product is custom and site-specific had no way for a homeowner or architect to start a conversation without already knowing what to ask for.',
    approach:
      'A site organised around the five stages of the work — measure, design, fabricate, finish, install — and a Start a Project flow that accepts a photo, a sketch or a rough measurement instead of a finished brief.',
    built: [
      'Next.js and TypeScript site with its own visual identity, separate from Hycyon',
      'Server-validated enquiry flow with spam and rate protection, and WhatsApp, phone and email fallbacks',
      'Rule-based project assistant that answers only from the site and never quotes prices',
      'Structure ready for real project photography and customer feedback — none of it invented',
    ],
    next: 'Real installations, photographs and customer words. Until the owner supplies them, the site shows labelled representative drawings.',
    href: 'https://ironsirony.hycyon.com/',
    hrefLabel: "Visit iron's irony",
  },
];

export const labKinds = [
  ['Experiment', 'An idea tried to see what happens.'],
  ['Prototype', 'Works well enough to test with people.'],
  ['Research', 'Understanding before building.'],
  ['Product', 'Shipped, supported and maintained.'],
];
