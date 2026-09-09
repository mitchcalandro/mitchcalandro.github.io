export default {
  name: 'contactInfo',
  title: 'Contact',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first' },
    { name: 'formspreeId', title: 'Formspree Form ID', type: 'string', description: 'The form ID from your Formspree endpoint (the part after formspree.io/f/). Leave blank to hide the contact form.' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
