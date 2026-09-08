export default {
  name: 'rocketSpec',
  title: 'Rocket Spec',
  type: 'document',
  fields: [
    { name: 'title', title: 'Section Title', type: 'string', description: 'e.g. "Propulsion", "Dimensions", "Materials"', validation: Rule => Rule.required() },
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Spec details shown when this section is expanded',
    },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first in accordion' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'order' },
    prepare({ title, order }) { return { title, subtitle: `Order: ${order}` } },
  },
}
