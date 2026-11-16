import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { structure } from './structure'
 
export default defineConfig({
  name: 'project-aurelian',
  title: 'Project Aurelian',
  projectId: '59rhnpdt',
  dataset: 'production',
  // Served under /studio when deployed as a Vercel service alongside the site
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
