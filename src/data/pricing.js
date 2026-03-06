export const packages = [
  {
    id: 'launch',
    name: 'Launch Package',
    price: '$750',
    description: 'For new businesses starting from scratch.',
    popular: false,
  },
  {
    id: 'build',
    name: 'Build Package',
    price: '$1,200',
    description: 'For businesses upgrading their image and digital presence.',
    popular: true,
  },
  {
    id: 'website',
    name: 'Website Only',
    price: '$650',
    description: 'For businesses that have branding and need a website.',
    popular: false,
  },
  {
    id: 'brand',
    name: 'Brand Only',
    price: '$150',
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

// Map of feature -> package -> included/excluded for the comparison grid.
// Values are 'included' or 'excluded'; styling is handled in the table component.
export const featureMatrix = {
  brandIdentity: {
    launch: 'included',
    build: 'included',
    website: 'excluded',
    brand: 'included',
  },
  businessWebsite: {
    launch: 'included',
    build: 'included',
    website: 'included',
    brand: 'excluded',
  },
  landingPage: {
    launch: 'excluded',
    build: 'included',
    website: 'excluded',
    brand: 'excluded',
  },
  googleBusiness: {
    launch: 'included',
    build: 'included',
    website: 'included',
    brand: 'excluded',
  },
  stickers: {
    launch: 'excluded',
    build: 'included',
    website: 'included',
    brand: 'excluded',
  },
  businessCards: {
    launch: 'included',
    build: 'included',
    website: 'excluded',
    brand: 'excluded',
  },
};

