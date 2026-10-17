import { site, links, socials, founder } from '../data/site.mjs';
import { products } from '../data/products.mjs';

const org = {
  '@type': 'Organization',
  '@id': `${site.url}/#organization`,
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/assets/img/icon-512.png`,
  email: site.email,
  description: site.description,
  address: { '@type': 'PostalAddress', addressLocality: 'Varanasi', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
  founder: { '@type': 'Person', name: founder.name, url: links.portfolio },
  sameAs: socials.map((s) => s.href),
};

const website = {
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: `${site.url}/`,
  name: site.name,
  description: site.description,
  publisher: { '@id': org['@id'] },
  inLanguage: 'en',
};

// Only products that are actually live are described as software applications.
const apps = products
  .filter((p) => p.status === 'live')
  .map((p) => ({
    '@type': 'SoftwareApplication',
    name: p.name,
    url: p.website ?? p.application,
    applicationCategory: p.schemaCategory,
    operatingSystem: p.platforms.join(', '),
    description: p.description,
    publisher: { '@id': org['@id'] },
  }));

export const homeJsonLd = () => ({ '@context': 'https://schema.org', '@graph': [org, website, ...apps] });
