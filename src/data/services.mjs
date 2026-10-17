import { links } from './site.mjs';

// Client-facing summaries only. Packages, deliverables and prices live in the catalogue.

/** @type {import('./types.mjs').Service[]} */
export const services = [
  {
    name: 'Websites',
    category: 'websites',
    description: 'Fast, clear sites for businesses, creators and organisations — designed to be found and easy to trust.',
  },
  {
    name: 'Web Applications',
    category: 'web-apps',
    description: 'Accounts, dashboards and workflows that turn a process into a product people use daily.',
  },
  {
    name: 'Mobile Applications',
    category: 'mobile',
    description: 'Android and iOS apps, from first prototype to a backend-powered release.',
  },
  {
    name: 'Custom Software',
    category: 'custom',
    description: 'Tools shaped around how you actually work, when nothing off the shelf fits.',
  },
  {
    name: 'AI & Intelligent Systems',
    category: 'ai',
    description: 'Assistants, document Q&A and AI features built into products with the keys kept server-side.',
  },
  {
    name: 'Product Development',
    category: 'product',
    description: 'From concept to a shipped product — the way we build our own.',
  },
  {
    name: 'Automation & Integrations',
    category: 'extensions',
    description: 'Browser extensions, APIs and connectors that remove repetitive work.',
  },
].map((s) => ({ ...s, catalogueLink: links.catalogue }));
