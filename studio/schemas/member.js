export default {
  name: 'member',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'role', title: 'Role / Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'resumeUrl', title: 'Resume URL', type: 'url', description: 'Link to resume (Google Drive, LinkedIn, PDF, etc.)' },
    { name: 'bio', title: 'About Me', type: 'text', rows: 4, description: 'Short paragraph for potential employers' },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
