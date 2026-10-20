import { links } from './site.mjs';

// Add a product by appending to this array. Layout is an auto-fitting grid,
// so a fourth or fifth product needs no template changes.
// Every claim below was checked against the product's own repository / site source.

/** @type {import('./types.mjs').Product[]} */
export const products = [
  {
    name: 'eBook Pro',
    slug: 'ebook-pro',
    category: 'Reading & learning',
    status: 'live',
    statusNote: 'Web app available · Android release in preparation',
    description:
      'A reader for people who study what they read. Open your own PDF, EPUB and text files, then highlight, annotate, translate and turn passages into notes and flashcards.',
    website: links.ebookProSite,
    application: links.ebookProApp,
    features: [
      'PDF, EPUB and TXT reading with page-turn animation',
      'On-device OCR for scanned pages (English and Hindi)',
      'Translation between English, Hindi and about 28 other languages',
      'Notes, flashcards with spaced repetition, and research workspaces',
    ],
    platforms: ['Web', 'Android'],
    schemaCategory: 'EducationalApplication',
  },
  {
    name: 'BrainSpark',
    slug: 'brainspark',
    category: 'Competitive exam preparation',
    status: 'live',
    statusNote: 'Version 1.0 · Questions are AI-generated: check answers against your study material',
    description:
      'Mock tests built around your exam. Choose the exam, the topics and how many questions on each, and BrainSpark generates the paper, explains every answer and lets you ask a tutor about what you got wrong.',
    website: null,
    application: links.brainSpark,
    features: [
      '24 named exam targets, from SSC CGL and UPSC CSE to JEE, NEET and Bank PO',
      'Your own topic mix: set the questions per topic, up to 150 in a test',
      'Diagrams for geometry, physics, chemistry and reasoning questions',
      'English and Hindi, offline practice sets and per-topic results',
    ],
    platforms: ['Web'],
    schemaCategory: 'EducationalApplication',
  },
  {
    name: 'VaakBoard',
    slug: 'vaakboard',
    category: 'Language technology',
    status: 'coming',
    statusNote: 'iOS keyboard coming soon · the transliteration engine and a web demo run today',
    description:
      'A precision input system for Sanskrit and Devanāgarī, built around how the language is actually written — not a layout with letters swapped.',
    website: 'https://portfolio.hycyon.com/#vaakboard',
    application: 'https://portfolio.hycyon.com/sanskrit-keyboard.html',
    applicationLabel: 'Try the web demo',
    features: [
      'Latin and IAST to Devanāgarī, and back, with conjuncts, matras, anusvāra and visarga',
      'Deterministic rules: the same input always gives the same output',
      'Tested engine, shared by the web demo',
      'Native iOS keyboard in preparation',
    ],
    platforms: ['Web demo', 'iOS (coming soon)'],
    schemaCategory: 'UtilitiesApplication',
  },
];

export const statusLabels = {
  live: 'Live',
  beta: 'Beta',
  development: 'In development',
  experiment: 'Experiment',
  coming: 'Coming soon',
  client: 'Client project',
  later: 'Future',
};
