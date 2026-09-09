export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (R) => R.required() },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }] },
    { name: 'order', title: 'Order', type: 'number', description: 'Lower numbers appear first' },
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question' } },
}
