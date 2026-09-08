const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default {
  name: 'timelineMilestone',
  title: 'Timeline Milestone',
  type: 'document',
  fields: [
    {
      name: 'month',
      title: 'Month',
      type: 'number',
      description: '1 = January, 12 = December',
      validation: Rule => Rule.required().min(1).max(12),
    },
    { name: 'year', title: 'Year', type: 'number', validation: Rule => Rule.required().min(2024) },
    {
      name: 'goals',
      title: 'Goals',
      type: 'array',
      of: [{
        type: 'object',
        name: 'goal',
        fields: [
          { name: 'text', title: 'Goal Description', type: 'string', validation: Rule => Rule.required() },
          { name: 'completed', title: 'Completed?', type: 'boolean', initialValue: false },
        ],
        preview: {
          select: { title: 'text', completed: 'completed' },
          prepare({ title, completed }) { return { title, subtitle: completed ? '✓ Done' : 'In progress' } },
        },
      }],
    },
  ],
  orderings: [{ title: 'Newest First', name: 'dateDesc', by: [{ field: 'year', direction: 'desc' }, { field: 'month', direction: 'desc' }] }],
  preview: {
    select: { month: 'month', year: 'year' },
    prepare({ month, year }) {
      return { title: `${MONTHS[(month ?? 1) - 1]} ${year}` }
    },
  },
}
