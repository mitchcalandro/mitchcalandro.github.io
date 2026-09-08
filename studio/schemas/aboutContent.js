export default {
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  fields: [
    {
      name: 'body',
      title: 'About Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: '1–2 paragraphs about the project',
    },
    {
      name: 'featureBullets',
      title: 'Rocket Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points listing rocket features',
    },
    { name: 'photo', title: 'Rocket Photo', type: 'image', options: { hotspot: true } },
  ],
  preview: { prepare: () => ({ title: 'About Content' }) },
}
