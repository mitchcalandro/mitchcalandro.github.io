export default {
  name: 'phase',
  title: 'Project Phase',
  type: 'document',
  fields: [
    { name: 'name', title: 'Phase Name', type: 'string', validation: (R) => R.required(), description: 'e.g. "Phase 1 – Manufacturing"' },
    { name: 'order', title: 'Order', type: 'number', validation: (R) => R.required(), description: 'Lower numbers appear first' },
    { name: 'shortDescription', title: 'Short Description', type: 'string', description: 'One line shown on the phase card' },
    { name: 'body', title: 'Detailed Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'shortDescription' } },
}
