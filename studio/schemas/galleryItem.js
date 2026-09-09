export default {
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (R) => R.required() },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'phase', title: 'Phase', type: 'reference', to: [{ type: 'phase' }], description: 'Which phase this image belongs to' },
    { name: 'order', title: 'Order', type: 'number' },
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'caption', media: 'image' } },
}
