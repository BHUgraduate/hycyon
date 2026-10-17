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
    name: 'VaakBoard',
    kind: 'Product',
    description:
      'A native iOS keyboard for Sanskrit: IAST transliteration, phonetic input mapped to Devanāgarī, and an offline lexicon. Written in Swift around a custom trie engine. Live on the App Store.',
    href: 'https://portfolio.hycyon.com/',
    hrefLabel: 'See how it was built',
  },
];

export const labKinds = [
  ['Experiment', 'An idea tried to see what happens.'],
  ['Prototype', 'Works well enough to test with people.'],
  ['Research', 'Understanding before building.'],
  ['Product', 'Shipped, supported and maintained.'],
];
