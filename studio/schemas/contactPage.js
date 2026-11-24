import { captionFields } from './captionFields'

// One document, opened from Contact in the sidebar (see structure.js)
export default {
  name: 'contactPage',
  title: 'Contact page photo',
  type: 'document',
  fields: [
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        ...captionFields,
        { name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the photo for screen readers' },
      ],
      description: 'Shown beside the message form, under the interest form box. The whole photo shows and the form stretches to match its height, so a landscape photo works best; use the crop tool to trim it. Leave empty to show the form on its own.',
    },
  ],
  preview: { prepare: () => ({ title: 'Contact page photo' }) },
}
