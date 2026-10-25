export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline shown on the hero section',
    },
    {
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'text',
      rows: 3,
      description: '2–3 sentence tagline shown under the headline',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width background photo behind the headline on the Home page. Wide landscape photos work best (at least 1920px wide). Use the hotspot to keep the important part in frame.',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the Donate button — update when GoFundMe is live',
    },
    { name: 'projectBody', title: 'Project Description (in-depth)', type: 'array', of: [{ type: 'block' }, { type: 'image' }], description: 'Detailed project writeup for the Project Aurelian page' },
    { name: 'currentPhase', title: 'Current Phase', type: 'reference', to: [{ type: 'phase' }], description: 'The phase the project is currently in' },
    { name: 'lastUpdated', title: 'Last Updated', type: 'date', description: 'Shown in the footer' },
    { name: 'footerText', title: 'Footer Text', type: 'string', description: 'e.g. "Project Aurelian" — shown after the © in the footer' },
    { name: 'formspreeId', title: 'Formspree Form ID', type: 'string', description: 'The ID from your Formspree endpoint (the part after formspree.io/f/). Leave blank to use the ID built into the site.' },
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
}
