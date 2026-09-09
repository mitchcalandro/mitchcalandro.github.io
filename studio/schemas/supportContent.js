export default {
  name: 'supportContent',
  title: 'Support Us Content',
  type: 'document',
  fields: [
    {
      name: 'body',
      title: 'Support Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: '1–2 paragraphs explaining why support matters',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the main Support Us donate button',
    },
    {
      name: 'donationTiers',
      title: 'Suggested Amounts',
      type: 'array',
      description: 'Optional. Shown as quick-pick buttons above the donate button.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'amount', title: 'Amount (USD)', type: 'number', validation: (R) => R.required().positive() },
            { name: 'note', title: 'What it funds', type: 'string', description: 'Short line, e.g. "A set of igniters"' },
          ],
          preview: { select: { title: 'amount', subtitle: 'note' }, prepare: ({ title, subtitle }) => ({ title: `$${title}`, subtitle }) },
        },
      ],
    },
    { name: 'photo', title: 'Team Photo', type: 'image', options: { hotspot: true } },
  ],
  preview: { prepare: () => ({ title: 'Support Us Content' }) },
}
