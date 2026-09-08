const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default {
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    { name: 'title', title: 'Entry Title', type: 'string' },
    {
      name: 'month',
      title: 'Month',
      type: 'number',
      description: '1 = January, 12 = December',
      validation: Rule => Rule.required().min(1).max(12),
    },
    { name: 'year', title: 'Year', type: 'number', validation: Rule => Rule.required().min(2024) },
    {
      name: 'preview',
      title: 'Preview Text',
      type: 'text',
      rows: 2,
      description: '1–2 sentences shown on the card before clicking Read More',
    },
    {
      name: 'body',
      title: 'Full Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Full newsletter content. Mix text blocks and images freely.',
    },
  ],
  orderings: [{ title: 'Newest First', name: 'dateDesc', by: [{ field: 'year', direction: 'desc' }, { field: 'month', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', month: 'month', year: 'year' },
    prepare({ title, month, year }) {
      return { title, subtitle: `${MONTHS[(month ?? 1) - 1]} ${year}` }
    },
  },
}
