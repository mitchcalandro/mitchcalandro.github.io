export default {
  name: 'member',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'role', title: 'Role / Title', type: 'string', validation: Rule => Rule.required() },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'After uploading, click the crop icon on the photo to choose the framing: drag the box to crop, and drag the circle onto the face so it stays centred. Photos show as a 4:3 rectangle (a bit wider than tall). Upload at least 1000px wide so it stays sharp. Member photos never appear in the Gallery.',
    },
    { name: 'bio', title: 'About Me', type: 'text', rows: 4, description: 'Short paragraph for potential employers' },
    {
      name: 'tier',
      title: 'Tier',
      // Stored as a number so the Studio list can sort by role (leadership first)
      type: 'number',
      description: 'Controls how prominently this person appears on the Members page',
      initialValue: 3,
      options: {
        list: [
          { title: 'Leadership (large, top of page)', value: 1 },
          { title: 'Discipline Lead (medium)', value: 2 },
          { title: 'Member (small)', value: 3 },
        ],
        layout: 'radio',
      },
    },
    { name: 'order', title: 'Display Order', type: 'number', description: 'Lower number = appears first within a tier' },
    { name: 'contributions', title: 'Contributions', type: 'array', of: [{ type: 'block' }] },
    { name: 'futureAspirations', title: 'Future Aspirations', type: 'array', of: [{ type: 'block' }] },
    { name: 'resumeUrl', title: 'Resume URL', type: 'url', description: 'Link to resume (Google Drive, LinkedIn, PDF, etc.)' },
    { name: 'portfolioUrl', title: 'Portfolio URL', type: 'url', description: 'Link to a personal portfolio or website. Leave empty to hide the button.' },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
  ],
  orderings: [
    {
      title: 'Role, then Display Order',
      name: 'roleThenDisplayOrder',
      by: [{ field: 'tier', direction: 'asc' }, { field: 'order', direction: 'asc' }, { field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
