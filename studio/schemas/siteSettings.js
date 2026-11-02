// An image in the project text, with where it sits and how big it is
const projectImage = {
  type: 'image',
  // Rich-text images open in a small popover by default, which closes when a crop drag ends outside it
  options: { hotspot: true, modal: { type: 'dialog', width: 'auto' } },
  fields: [
    {
      name: 'position',
      title: 'Position',
      type: 'string',
      initialValue: 'right',
      options: {
        list: [
          { title: 'Left (text wraps on its right)', value: 'left' },
          { title: 'Right (text wraps on its left)', value: 'right' },
          { title: 'Centred (no text beside it)', value: 'center' },
          { title: 'Full width', value: 'full' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'size',
      title: 'Size',
      type: 'string',
      initialValue: 'medium',
      description: 'Share of the text column the image takes up',
      options: {
        list: [
          { title: 'Small (a third)', value: 'small' },
          { title: 'Medium (half)', value: 'medium' },
          { title: 'Large (two thirds)', value: 'large' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.position === 'full',
    },
    { name: 'caption', title: 'Caption', type: 'string', description: 'Optional, shown under the image' },
    { name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the image for screen readers' },
  ],
}

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
      description: 'Photo beside "Who are we?" on the Home page. It shows as a square, so use the hotspot to keep the important part in frame (at least 1000px wide).',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Small round logo beside the big title on the Home page. Leave empty to hide it.',
    },
    {
      name: 'whoWeAre',
      title: 'Who are we?',
      type: 'text',
      rows: 6,
      description: 'Shown beside the photo on the Home page. Leave a blank line between paragraphs. If empty, the Hero Tagline is used.',
    },
    {
      name: 'ourBeginnings',
      title: 'Our beginnings',
      type: 'text',
      rows: 8,
      description: 'How the team started, shown under the photo on the Home page. Leave empty to hide the section.',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the Donate button — update when GoFundMe is live',
    },
    {
      name: 'projectBody',
      title: 'Project Description (in-depth)',
      type: 'array',
      description: 'Detailed project writeup for the Project Aurelian page. Click an image to choose where it sits and how the text wraps around it. Insert Columns to put text side by side.',
      of: [
        { type: 'block' },
        projectImage,
        {
          name: 'columns',
          title: 'Columns',
          type: 'object',
          options: { modal: { type: 'dialog', width: 'auto' } },
          fields: [
            {
              name: 'columns',
              title: 'Columns',
              type: 'array',
              description: '2 or 3 columns side by side; they stack on phones',
              of: [{
                name: 'column',
                title: 'Column',
                type: 'object',
                fields: [{ name: 'body', title: 'Text', type: 'array', of: [{ type: 'block' }, projectImage] }],
                preview: {
                  select: { body: 'body' },
                  prepare: ({ body }) => ({ title: body?.find((b) => b._type === 'block')?.children?.map((c) => c.text).join('') || 'Empty column' }),
                },
              }],
              validation: (Rule) => Rule.min(2).max(3),
            },
          ],
          preview: {
            select: { columns: 'columns' },
            prepare: ({ columns }) => ({ title: `${columns?.length || 0} columns` }),
          },
        },
      ],
    },
    { name: 'currentPhase', title: 'Current Phase', type: 'reference', to: [{ type: 'phase' }], description: 'The phase the project is currently in' },
    { name: 'lastUpdated', title: 'Last Updated', type: 'date', description: 'Shown in the footer' },
    { name: 'footerText', title: 'Footer Text', type: 'string', description: 'e.g. "Project Aurelian" — shown after the © in the footer' },
    { name: 'formspreeId', title: 'Formspree Form ID', type: 'string', description: 'The ID from your Formspree endpoint (the part after formspree.io/f/). Leave blank to use the ID built into the site.' },
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
}
