/**
 * Showcase projects config.
 * Add entries when you add images to public/showcase/websites, branding, or print.
 * Image paths are relative to public (e.g. /showcase/websites/myproject.jpg).
 */
export const showcaseCategories = ['websites', 'branding', 'print'];

const placeholder = (text) => `https://placehold.co/800x600/0f0f0f/444?text=${encodeURIComponent(text)}`;

export const showcaseProjects = [
  { category: 'websites', image: placeholder('Website'), title: 'Website Project One' },
  { category: 'websites', image: placeholder('Website'), title: 'Website Project Two' },
  { category: 'websites', image: placeholder('Website'), title: 'Website Project Three' },
  { category: 'branding', image: placeholder('Brand'), title: 'Brand Identity One' },
  { category: 'branding', image: placeholder('Brand'), title: 'Brand Identity Two' },
  { category: 'branding', image: placeholder('Brand'), title: 'Brand Identity Three' },
  { category: 'print', image: placeholder('Print'), title: 'Print Project One' },
  { category: 'print', image: placeholder('Print'), title: 'Print Project Two' },
  { category: 'print', image: placeholder('Print'), title: 'Print Project Three' },
];
