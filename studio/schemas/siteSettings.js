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
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the Donate button — update when GoFundMe is live',
    },
    { name: 'projectBody', title: 'Project Description (in-depth)', type: 'array', of: [{ type: 'block' }, { type: 'image' }], description: 'Detailed project writeup for the Project Aurelian page' },
    { name: 'currentPhase', title: 'Current Phase', type: 'reference', to: [{ type: 'phase' }], description: 'The phase the project is currently in' },
    { name: 'lastUpdated', title: 'Last Updated', type: 'date', description: 'Shown in the footer' },
    { name: 'footerText', title: 'Footer Text', type: 'string', description: 'e.g. "Project Aurelian" — shown after the © in the footer' },
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
}
