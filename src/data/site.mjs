// Facts used across the site. Change here, rebuild, every page updates.

export const site = {
  name: 'Hycyon',
  url: 'https://hycyon.com',
  tagline: 'Technology · Products · Software',
  title: 'Hycyon — Technology, Products & Software',
  description:
    'Hycyon is a technology and product studio in India. We build websites, apps and AI software for clients, and our own products like eBook Pro and BrainSpark.',
  email: 'hycyon.hq@gmail.com',
  location: 'Varanasi, Uttar Pradesh, India',
  updated: '2026-10-25',
  themeColor: { light: '#f5f3ee', dark: '#0b0e12' },
};

// Each site in the ecosystem has exactly one job.
export const links = {
  catalogue: 'https://catalogue.hycyon.com/',
  startProject: 'https://catalogue.hycyon.com/#quote',
  portfolio: 'https://portfolio.hycyon.com/',
  ebookProSite: 'https://ebookpro.hycyon.com/',
  ebookProApp: 'https://ebookpro.web.app/',
  brainSpark: 'https://brainsparkos.web.app/',
};

// Verified handles only. Add Reddit / Discord here once exact URLs are confirmed.
export const socials = [
  { name: 'GitHub', href: 'https://github.com/BHUgraduate' },
  { name: 'YouTube', href: 'https://www.youtube.com/@hycyonhq' },
  { name: 'Instagram', href: 'https://www.instagram.com/hycyonhq/' },
  { name: 'X', href: 'https://x.com/hycyon' },
  { name: 'Facebook', href: 'https://www.facebook.com/hycyon' },
];

export const founder = {
  name: 'Abhishek Sharma',
  role: 'Founder · Engineer · Product Builder',
  linkedin: 'https://linkedin.com/in/bhugraduate',
};

export const nav = [
  { label: 'Products', href: '/#products' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Lab', href: '/#lab' },
  { label: 'About', href: '/#about' },
];

export const ecosystemMenu = [
  {
    group: 'Products',
    items: [
      { label: 'eBook Pro', href: links.ebookProSite },
      { label: 'BrainSpark', href: links.brainSpark },
      { label: 'VaakBoard', href: 'https://portfolio.hycyon.com/#vaakboard' },
    ],
  },
  { group: 'Services', items: [{ label: 'Service Catalogue', href: links.catalogue }] },
  { group: 'Engineering', items: [{ label: 'Portfolio', href: links.portfolio }] },
];
