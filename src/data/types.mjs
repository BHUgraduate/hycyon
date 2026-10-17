// Data models. Plain JSDoc so editors type-check the data files and
// scripts/check.mjs validates them at build time.

/**
 * @typedef {'live'|'beta'|'development'|'experiment'|'later'} Status
 *
 * @typedef {Object} Product
 * @property {string} name
 * @property {string} slug
 * @property {string} category        Short category label, e.g. "Reading & learning".
 * @property {Status} status
 * @property {string} statusNote      Honest one-liner qualifying the status.
 * @property {string} description
 * @property {string} website         Product marketing site (null when none exists).
 * @property {string} application     The product itself.
 * @property {string[]} features      Only verified features.
 * @property {string[]} platforms
 * @property {string} schemaCategory  schema.org applicationCategory.
 *
 * @typedef {Object} Service
 * @property {string} name
 * @property {string} description
 * @property {string} category        Mirrors the catalogue category id.
 * @property {string} catalogueLink
 *
 * @typedef {Object} LabEntry
 * @property {string} name
 * @property {'Experiment'|'Prototype'|'Research'|'Product'} kind
 * @property {string} description
 * @property {string} href
 * @property {string} hrefLabel
 */
export {};
