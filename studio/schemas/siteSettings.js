import { formattedLine } from './formattedLine'

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
      ...formattedLine,
      description: 'Short line shown under the big title on the Home page, e.g. "Student-Led Liquid Rocketry"',
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
      description: 'Shown beside the big title on the Home page and small in the top bar. Use the crop tool to trim it close around the artwork; any empty space around it makes it look smaller. Leave empty to hide it.',
    },
    {
      name: 'whoWeAre',
      title: 'Who are we?',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Shown beside the photo on the Home page',
    },
    {
      name: 'ourBeginnings',
      title: 'Our beginnings',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How the team started, shown under the photo on the Home page. Leave empty to hide the section.',
    },
    {
      name: 'beginningsImage',
      title: 'Our beginnings photo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the photo for screen readers' }],
      description: 'Shown to the right of "Our beginnings", stretched to the height of the text (4:3 under it on phones). The edges get trimmed to fit, so set the hotspot on the important part. Leave empty to show the text alone.',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the Donate button — update when GoFundMe is live',
    },
    {
      name: 'interestFormUrl',
      title: 'Interest Form URL',
      type: 'url',
      description: 'Link for people who want to join the project, shown as a box on the Contact page. Leave blank to use the Google Form built into the site.',
    },
    {
      name: 'projectPhoto',
      title: 'Project page photo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the photo for screen readers' }],
      description: 'Shown to the right of the project description with the text wrapping around it (above the text on phones). The whole photo shows; use the crop tool to trim it. Leave empty to show the text alone.',
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
