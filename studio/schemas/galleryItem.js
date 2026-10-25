export default {
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (R) => R.required(),
      description: 'Shown exactly as uploaded — the Gallery never crops it. Images added to Newsletters, Phases and the Project write-up appear in the Gallery automatically, so only add an image here if it isn\'t posted anywhere else.',
    },
    { name: 'caption', title: 'Caption', type: 'string', description: 'Short title shown under the image' },
    { name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Shown when a visitor clicks the image to view it full size' },
    { name: 'phase', title: 'Phase', type: 'reference', to: [{ type: 'phase' }], description: 'Which phase this image belongs to' },
    { name: 'order', title: 'Order', type: 'number' },
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'caption', media: 'image' } },
}
