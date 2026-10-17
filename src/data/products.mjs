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
    category: 'Exam preparation',
    status: 'live',
    statusNote: 'Version 1.0',
    description:
      'An AI-assisted exam preparation platform. Build multi-topic mock tests, review every answer, and ask an AI tutor to explain what you got wrong.',
    website: null,
    application: links.brainSpark,
    features: [
      'Mock exams generated from your topics, difficulty and time limit',
      'AI tutor and doubt solver on every question',
      'Offline practice and daily reminders',
      'English and Hindi interface',
    ],
    platforms: ['Web'],
    schemaCategory: 'EducationalApplication',
  },
];

export const statusLabels = {
  live: 'Live',
  beta: 'Beta',
  development: 'In development',
  experiment: 'Experiment',
  later: 'Coming later',
};
