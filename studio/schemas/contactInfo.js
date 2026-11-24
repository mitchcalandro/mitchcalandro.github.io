export default {
  name: 'contactInfo',
  title: 'Contact',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', description: 'Spell it exactly as on their Member entry to show their member photo on the Contact page', validation: Rule => Rule.required() },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
