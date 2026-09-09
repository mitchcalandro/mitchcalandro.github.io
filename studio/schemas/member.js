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
    {
      name: 'tier',
      title: 'Tier',
      type: 'string',
      description: 'Controls how prominently this person appears on the Members page',
      initialValue: 'member',
      options: {
        list: [
          { title: 'Leadership (large, top of page)', value: 'leadership' },
          { title: 'Discipline Lead (medium)', value: 'lead' },
          { title: 'Member (small)', value: 'member' },
        ],
        layout: 'radio',
      },
    },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first within a tier' },
    { name: 'contributions', title: 'Contributions', type: 'array', of: [{ type: 'block' }] },
    { name: 'futureAspirations', title: 'Future Aspirations', type: 'array', of: [{ type: 'block' }] },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
