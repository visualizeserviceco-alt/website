/**
 * Showcase projects config.
 * Preview images from public/showcase/websites/ (sourced from assets/images/Websites).
 */
export const showcaseCategories = ['websites', 'branding', 'print'];

const preview = (id) => `/showcase/websites/${id}.png`;

export const showcaseProjects = [
  {
    id: 'papsprod',
    title: 'Paps Production',
    category: 'websites',
    description: 'Website and branding for Paps Production, a photographer.',
    image: preview('papsprod'),
    url: 'https://www.papsprod.com/',
  },
  {
    id: 'abyssinia',
    title: 'Abyssinia Bar & Restaurant',
    category: 'websites',
    description: 'Website and branding for Abyssinia, an Ethiopian restaurant.',
    image: preview('abyssinia'),
    url: 'https://abyssiniabarandrestaurant.com',
  },
  {
    id: 'mnck',
    title: 'MNCK Property Maintenance',
    category: 'websites',
    description: 'Website and branding for a veteran-owned property maintenance company in Delaware County, PA.',
    image: preview('mnck'),
    url: 'https://mnck.visualizeclients.com/',
  },
  {
    id: 'sopesdetailing',
    title: 'Sopes Detailing',
    category: 'websites',
    description: 'Website and branding for Billy Soper, a local auto detailer.',
    image: preview('sopesdetailing'),
    url: 'https://sopesdetailing.visualizeclients.com',
  },
];
