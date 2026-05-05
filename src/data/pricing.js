export const packages = [
  {
    id: 'launch',
    name: 'Launch Package',
    description: 'For new businesses starting from scratch.',
    popular: false,
  },
  {
    id: 'build',
    name: 'Build Package',
    description: 'For businesses upgrading their image and digital presence.',
    popular: true,
  },
  {
    id: 'website',
    name: 'Website Only',
    description: 'For businesses that have branding and need a website.',
    popular: false,
  },
  {
    id: 'brand',
    name: 'Brand Only',
    description: 'For branding without a website.',
    popular: false,
  },
];

export const features = [
  { id: 'brandIdentity', label: 'Brand identity (logo + system)' },
  { id: 'businessWebsite', label: '5-page business website' },
  { id: 'landingPage', label: 'Landing page' },
  { id: 'googleBusiness', label: 'Google Business optimization' },
  { id: 'stickers', label: '100 Custom Stickers Included' },
  { id: 'businessCards', label: 'Business card design + print coordination' },
];

export const featureMatrix = {
  brandIdentity:   { launch: 'included', build: 'included', website: 'excluded', brand: 'included' },
  businessWebsite: { launch: 'included', build: 'included', website: 'included', brand: 'excluded' },
  landingPage:     { launch: 'excluded', build: 'included', website: 'excluded', brand: 'excluded' },
  googleBusiness:  { launch: 'included', build: 'included', website: 'included', brand: 'excluded' },
  stickers:        { launch: 'excluded', build: 'included', website: 'included', brand: 'excluded' },
  businessCards:   { launch: 'included', build: 'included', website: 'excluded', brand: 'excluded' },
};
