# Project Aurelian Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Project Aurelian single-page website with a React + Vite frontend, Sanity CMS managing all content, and automated GitHub Pages deployment.

**Architecture:** The frontend is a React + Vite single-page app where each section component fetches its own content from Sanity's public read API via a shared `useSanityFetch` hook. The Sanity Studio lives in a `studio/` subdirectory and is deployed separately to `sanity.studio`. A GitHub Actions workflow builds and deploys the frontend to GitHub Pages on every push to `main`.

**Tech Stack:** React 18, Vite 5, `@sanity/client` v3, `@sanity/image-url`, `@portabletext/react`, `peaceiris/actions-gh-pages` (GitHub Action), Vitest + `@testing-library/react` for smoke tests, CSS custom properties (no CSS framework).

## Global Constraints

- React 18+, Vite 5+, Node 20+
- Sanity v3 API, `apiVersion: '2024-01-01'`, `useCdn: true`
- No CSS framework — all styles via CSS custom properties defined in `src/index.css`
- Never hardcode hex values in components — use CSS variables (`var(--accent)`, etc.)
- `base: '/'` in `vite.config.js` (assumes custom domain; if no domain yet, use `/RocketSite/`)
- All text content fetched from Sanity — no hardcoded strings in components except fallback UI
- Section IDs must exactly match: `home`, `newsletter`, `about`, `rocket`, `timeline`, `members`, `support`, `contact`
- Placeholder images: `public/placeholder-hero.svg`, `public/placeholder-photo.svg`
- Commits use conventional format: `feat:`, `chore:`, `fix:`

---

### Task 1: Vite + React Scaffolding + Test Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx` (shell only)
- Create: `src/test/setup.js`
- Create: `src/test/mocks/sanity.js`
- Create: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Produces: `App` default export from `src/App.jsx` — renders `<div id="app-root" />` with placeholder text until wired in Task 15

- [ ] **Step 1: Initialize the project**

Run from `/Users/dylanirons/Projects/RocketSite`:
```bash
npm create vite@latest . -- --template react
```
Select "React" and "JavaScript" when prompted. This overwrites the default `src/` with Vite's scaffold — that's expected.

- [ ] **Step 2: Install all dependencies upfront**

```bash
npm install @sanity/client @sanity/image-url @portabletext/react
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Replace `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Add test scripts to `package.json`**

Open `package.json` and ensure the `scripts` block includes:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Create test setup file**

```js
// src/test/setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create Sanity mock for tests**

```js
// src/test/mocks/sanity.js
import { vi } from 'vitest'

vi.mock('../../lib/sanity', () => ({
  client: { fetch: vi.fn().mockResolvedValue(null) },
  urlFor: vi.fn(() => ({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('/placeholder-photo.svg'),
  })),
  queries: {
    siteSettings: '',
    newsletter: '',
    about: '',
    rocketSpecs: '',
    timeline: '',
    members: '',
    support: '',
    contact: '',
  },
}))
```

- [ ] **Step 7: Replace `src/App.jsx` with shell**

```jsx
export default function App() {
  return <div id="app-root"><p>Project Aurelian — coming soon</p></div>
}
```

- [ ] **Step 8: Replace `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 9: Create `.env.example`**

```
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

- [ ] **Step 10: Create `.gitignore`** (ensure these entries exist)

```
node_modules/
dist/
.env
.env.local
studio/node_modules/
studio/dist/
```

- [ ] **Step 11: Write smoke test**

```jsx
// src/test/App.test.jsx
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.getElementById('app-root')).toBeInTheDocument()
  })
})
```

- [ ] **Step 12: Run test to verify it passes**

```bash
npm test
```
Expected: PASS

- [ ] **Step 13: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server at `http://localhost:5173` showing "Project Aurelian — coming soon"

- [ ] **Step 14: Commit**

```bash
git add package.json vite.config.js index.html src/ .gitignore .env.example
git commit -m "chore: scaffold React + Vite project with test setup"
```

---

### Task 2: Placeholder Assets + Global Styles

**Files:**
- Create: `public/placeholder-hero.svg`
- Create: `public/placeholder-photo.svg`
- Modify: `src/index.css` (full replacement)

**Interfaces:**
- Produces: CSS custom properties consumed by all components — variable names are the contract; never use raw hex in components

- [ ] **Step 1: Create hero placeholder SVG**

```svg
<!-- public/placeholder-hero.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="800" viewBox="0 0 1920 800">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a2744"/>
      <stop offset="100%" style="stop-color:#0a0f1e"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="800" fill="url(#g)"/>
  <text x="960" y="415" font-family="sans-serif" font-size="28" fill="#4a5568" text-anchor="middle">Hero photo coming soon</text>
</svg>
```

- [ ] **Step 2: Create photo placeholder SVG**

```svg
<!-- public/placeholder-photo.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a2744"/>
      <stop offset="100%" style="stop-color:#0a0f1e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="208" font-family="sans-serif" font-size="16" fill="#4a5568" text-anchor="middle">Photo coming soon</text>
</svg>
```

- [ ] **Step 3: Replace `src/index.css` entirely**

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --bg-dark: #0A0F1E;
  --bg-alt: #111827;
  --accent: #2563EB;
  --accent-hover: #60A5FA;
  --text-light: #F8FAFC;
  --text-muted: #94A3B8;
  --text-dark: #0F172A;
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Inter', sans-serif;
  --navbar-height: 72px;
  --section-padding: 6rem 2rem;
  --max-width: 1200px;
  --radius: 8px;
  --transition: 0.2s ease;
  --card-bg: #161f35;
  --border: rgba(255,255,255,0.08);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-light);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
  letter-spacing: 0.04em;
}

a {
  color: var(--accent-hover);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
  font-family: var(--font-body);
}

img {
  max-width: 100%;
  display: block;
}

section {
  padding: var(--section-padding);
  scroll-margin-top: var(--navbar-height);
}

section:nth-of-type(even) {
  background-color: var(--bg-alt);
}

.section-container {
  max-width: var(--max-width);
  margin: 0 auto;
}

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  color: var(--text-light);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 600px;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: var(--text-light);
  padding: 0.75rem 2rem;
  border-radius: var(--radius);
  border: none;
  font-size: 1rem;
  font-weight: 600;
  transition: background var(--transition);
  text-decoration: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
  text-decoration: none;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  :root {
    --section-padding: 4rem 1.25rem;
  }
}
```

- [ ] **Step 4: Verify dev server shows styles**

```bash
npm run dev
```
Background should be `#0A0F1E` (dark navy).

- [ ] **Step 5: Commit**

```bash
git add public/ src/index.css
git commit -m "chore: add placeholder SVGs and global design tokens"
```

---

### Task 3: GitHub Actions Deploy Pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` producing `dist/`
- Produces: Automated deployment to `gh-pages` branch on push to `main`

- [ ] **Step 1: Create the workflow file**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SANITY_PROJECT_ID: ${{ secrets.VITE_SANITY_PROJECT_ID }}
          VITE_SANITY_DATASET: ${{ secrets.VITE_SANITY_DATASET }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: ''
```

- [ ] **Step 2: Configure GitHub Pages (manual steps in browser)**

  1. Go to the repo on GitHub → Settings → Pages
  2. Set Source to "Deploy from a branch"
  3. Set Branch to `gh-pages`, folder `/` (root)
  4. Click Save

- [ ] **Step 3: Add GitHub Secrets (manual steps in browser)**

  These will be filled after Task 4 (Sanity setup). For now just note:
  - Go to repo → Settings → Secrets and variables → Actions
  - Add: `VITE_SANITY_PROJECT_ID` (value from Sanity dashboard)
  - Add: `VITE_SANITY_DATASET` (value: `production`)

- [ ] **Step 4: Verify build passes locally**

```bash
VITE_SANITY_PROJECT_ID=placeholder VITE_SANITY_DATASET=production npm run build
```
Expected: `dist/` folder created with no errors.

- [ ] **Step 5: Commit and verify action runs**

```bash
git add .github/
git commit -m "chore: add GitHub Actions deploy pipeline"
git push origin main
```
Expected: GitHub Actions tab shows workflow running and deploying.

---

### Task 4: Sanity Project + Studio Initialization

**Files:**
- Create: `studio/` directory (initialized by Sanity CLI)
- Create: `studio/sanity.config.js` (replace default)
- Create: `studio/schemas/index.js` (placeholder, schemas added in Task 5)

**Interfaces:**
- Produces: `projectId` and `dataset` values consumed by `src/lib/sanity.js` in Task 6

- [ ] **Step 1: Create a Sanity account**

  Go to https://sanity.io and sign up (free). No credit card needed.

- [ ] **Step 2: Initialize Sanity Studio in `studio/`**

Run from `/Users/dylanirons/Projects/RocketSite`:
```bash
npm create sanity@latest -- --output-path studio --project-id new --dataset production --template clean
```
When prompted:
- Project name: `project-aurelian`
- Dataset: `production`
- Package manager: npm

This creates `studio/` with its own `package.json` and initial config.

- [ ] **Step 3: Note your project ID**

After initialization, the CLI prints your project ID (e.g. `abc12345`). Find it at https://sanity.io/manage → your project → API settings. You will need it in Step 5 and for GitHub Secrets.

- [ ] **Step 4: Replace `studio/sanity.config.js`**

```js
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'project-aurelian',
  title: 'Project Aurelian',
  projectId: 'YOUR_PROJECT_ID', // Replace with actual ID from Step 3
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

- [ ] **Step 5: Create placeholder `studio/schemas/index.js`**

```js
export const schemaTypes = []
```

- [ ] **Step 6: Verify Studio runs**

```bash
cd studio && npm run dev
```
Expected: Studio opens at `http://localhost:3333` — empty but working.

- [ ] **Step 7: Create `.env.local` in root for frontend**

```bash
# Back in root directory
echo "VITE_SANITY_PROJECT_ID=YOUR_PROJECT_ID" > .env.local
echo "VITE_SANITY_DATASET=production" >> .env.local
```
Replace `YOUR_PROJECT_ID` with your actual Sanity project ID.

- [ ] **Step 8: Add GitHub Secrets** (now that you have the project ID)

  Go to repo → Settings → Secrets and variables → Actions → New repository secret:
  - `VITE_SANITY_PROJECT_ID` = your Sanity project ID
  - `VITE_SANITY_DATASET` = `production`

- [ ] **Step 9: Commit studio config**

```bash
git add studio/sanity.config.js studio/schemas/index.js
git commit -m "chore: initialize Sanity Studio for Project Aurelian"
```

---

### Task 5: Sanity Schemas (All Content Types)

**Files:**
- Create: `studio/schemas/siteSettings.js`
- Create: `studio/schemas/newsletter.js`
- Create: `studio/schemas/member.js`
- Create: `studio/schemas/rocketSpec.js`
- Create: `studio/schemas/timelineMilestone.js`
- Create: `studio/schemas/aboutContent.js`
- Create: `studio/schemas/supportContent.js`
- Create: `studio/schemas/contactInfo.js`
- Modify: `studio/schemas/index.js`

**Interfaces:**
- Produces: Sanity document types consumed by GROQ queries in Task 6. Field names are the contract — any rename here requires a matching rename in `src/lib/sanity.js`.

- [ ] **Step 1: Create `studio/schemas/siteSettings.js`**

```js
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline shown on the hero section',
    },
    {
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'text',
      rows: 3,
      description: '2–3 sentence tagline shown under the headline',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the Donate button — update when GoFundMe is live',
    },
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
}
```

- [ ] **Step 2: Create `studio/schemas/newsletter.js`**

```js
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default {
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    { name: 'title', title: 'Entry Title', type: 'string' },
    {
      name: 'month',
      title: 'Month',
      type: 'number',
      description: '1 = January, 12 = December',
      validation: Rule => Rule.required().min(1).max(12),
    },
    { name: 'year', title: 'Year', type: 'number', validation: Rule => Rule.required().min(2024) },
    {
      name: 'preview',
      title: 'Preview Text',
      type: 'text',
      rows: 2,
      description: '1–2 sentences shown on the card before clicking Read More',
    },
    {
      name: 'body',
      title: 'Full Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Full newsletter content. Mix text blocks and images freely.',
    },
  ],
  orderings: [{ title: 'Newest First', name: 'dateDesc', by: [{ field: 'year', direction: 'desc' }, { field: 'month', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', month: 'month', year: 'year' },
    prepare({ title, month, year }) {
      return { title, subtitle: `${MONTHS[(month ?? 1) - 1]} ${year}` }
    },
  },
}
```

- [ ] **Step 3: Create `studio/schemas/member.js`**

```js
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
```

- [ ] **Step 4: Create `studio/schemas/rocketSpec.js`**

```js
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
```

- [ ] **Step 5: Create `studio/schemas/timelineMilestone.js`**

```js
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
```

- [ ] **Step 6: Create `studio/schemas/aboutContent.js`**

```js
export default {
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  fields: [
    {
      name: 'body',
      title: 'About Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: '1–2 paragraphs about the project',
    },
    {
      name: 'featureBullets',
      title: 'Rocket Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points listing rocket features',
    },
    { name: 'photo', title: 'Rocket Photo', type: 'image', options: { hotspot: true } },
  ],
  preview: { prepare: () => ({ title: 'About Content' }) },
}
```

- [ ] **Step 7: Create `studio/schemas/supportContent.js`**

```js
export default {
  name: 'supportContent',
  title: 'Support Us Content',
  type: 'document',
  fields: [
    {
      name: 'body',
      title: 'Support Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: '1–2 paragraphs explaining why support matters',
    },
    {
      name: 'goFundMeUrl',
      title: 'GoFundMe URL',
      type: 'url',
      description: 'Link for the main Support Us donate button',
    },
    { name: 'photo', title: 'Team Photo', type: 'image', options: { hotspot: true } },
  ],
  preview: { prepare: () => ({ title: 'Support Us Content' }) },
}
```

- [ ] **Step 8: Create `studio/schemas/contactInfo.js`**

```js
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
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
}
```

- [ ] **Step 9: Update `studio/schemas/index.js` to register all schemas**

```js
import siteSettings from './siteSettings'
import newsletter from './newsletter'
import member from './member'
import rocketSpec from './rocketSpec'
import timelineMilestone from './timelineMilestone'
import aboutContent from './aboutContent'
import supportContent from './supportContent'
import contactInfo from './contactInfo'

export const schemaTypes = [
  siteSettings,
  newsletter,
  member,
  rocketSpec,
  timelineMilestone,
  aboutContent,
  supportContent,
  contactInfo,
]
```

- [ ] **Step 10: Verify all schemas appear in Studio**

```bash
cd studio && npm run dev
```
Open `http://localhost:3333` — the left sidebar should list: Site Settings, Newsletter, Team Member, Rocket Spec, Timeline Milestone, About Content, Support Us Content, Contact.

- [ ] **Step 11: Add placeholder content in Studio**

  In Studio, create one document for each singleton (Site Settings, About Content, Support Us Content) with placeholder text. Also add 2–3 Newsletter entries, 2 Members, 2–3 Rocket Specs, 2 Timeline Milestones, and 2 Contacts with placeholder text. This allows the frontend to render real data during development.

- [ ] **Step 12: Commit**

```bash
cd .. # back to root
git add studio/schemas/
git commit -m "feat: add all Sanity content schemas"
```

---

### Task 6: Sanity Client + useSanityFetch Hook

**Files:**
- Create: `src/lib/sanity.js`
- Create: `src/hooks/useSanityFetch.js`
- Test: `src/test/useSanityFetch.test.js`

**Interfaces:**
- Produces:
  - `client` — Sanity client instance
  - `urlFor(source)` — returns image URL builder chain (call `.width(n).url()`)
  - `queries` — object with GROQ query strings, keys: `siteSettings`, `newsletter`, `about`, `rocketSpecs`, `timeline`, `members`, `support`, `contact`
  - `useSanityFetch(query)` — returns `{ data, loading, error }`

- [ ] **Step 1: Create `src/lib/sanity.js`**

```js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]{ heroHeadline, heroTagline, goFundMeUrl }`,
  newsletter: `*[_type == "newsletter"] | order(year desc, month desc){ _id, title, month, year, preview, body }`,
  about: `*[_type == "aboutContent"][0]{ body, featureBullets, photo }`,
  rocketSpecs: `*[_type == "rocketSpec"] | order(order asc){ _id, title, body }`,
  timeline: `*[_type == "timelineMilestone"] | order(year desc, month desc){ _id, month, year, goals }`,
  members: `*[_type == "member"] | order(order asc){ _id, name, role, photo, resumeUrl, bio }`,
  support: `*[_type == "supportContent"][0]{ body, goFundMeUrl, photo }`,
  contact: `*[_type == "contactInfo"] | order(order asc){ _id, name, role, email, linkedInUrl }`,
}
```

- [ ] **Step 2: Create `src/hooks/useSanityFetch.js`**

```js
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

export function useSanityFetch(query) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    client
      .fetch(query)
      .then(result => { setData(result); setLoading(false) })
      .catch(err => { setError(err); setLoading(false) })
  }, [query])

  return { data, loading, error }
}
```

- [ ] **Step 3: Write failing test**

```js
// src/test/useSanityFetch.test.js
import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { client } from '../lib/sanity'

vi.mock('../lib/sanity', () => ({
  client: { fetch: vi.fn() },
  queries: {},
}))

describe('useSanityFetch', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns loading true initially', () => {
    client.fetch.mockResolvedValue({ title: 'Test' })
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    expect(result.current.loading).toBe(true)
  })

  it('returns fetched data when resolved', async () => {
    client.fetch.mockResolvedValue({ title: 'Hello' })
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ title: 'Hello' })
    expect(result.current.error).toBeNull()
  })

  it('returns error on fetch failure', async () => {
    client.fetch.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.data).toBeNull()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `useSanityFetch` not yet importable (hook file doesn't exist yet from test's perspective if run before creating)

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test
```
Expected: PASS — all 3 tests pass

- [ ] **Step 6: Commit**

```bash
git add src/lib/sanity.js src/hooks/useSanityFetch.js src/test/useSanityFetch.test.js
git commit -m "feat: add Sanity client, image builder, GROQ queries, and useSanityFetch hook"
```

---

### Task 7: Navbar Component

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.css`
- Test: `src/test/Navbar.test.jsx`

**Interfaces:**
- Produces: `Navbar` default export — renders `<nav className="navbar">` with logo and nav links; scrolls to section on click; highlights active section

- [ ] **Step 1: Write failing test**

```jsx
// src/test/Navbar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  it('renders the logo text', () => {
    render(<Navbar />)
    expect(screen.getByText('PROJECT AURELIAN')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    const labels = ['Home', 'Newsletter', 'About', 'Rocket', 'Timeline', 'Members', 'Support Us', 'Contact']
    labels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
  })

  it('calls scrollIntoView on nav link click', () => {
    const mockScroll = vi.fn()
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScroll })
    render(<Navbar />)
    fireEvent.click(screen.getByText('About'))
    expect(mockScroll).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- Navbar
```
Expected: FAIL — component does not exist

- [ ] **Step 3: Create `src/components/Navbar.jsx`**

```jsx
import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'about', label: 'About' },
  { id: 'rocket', label: 'Rocket' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'members', label: 'Members' },
  { id: 'support', label: 'Support Us' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <span className="navbar__logo">PROJECT AURELIAN</span>

      <button
        className="navbar__burger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        ☰
      </button>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`navbar__link ${activeSection === id ? 'navbar__link--active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 4: Create `src/components/Navbar.css`**

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: rgba(10, 15, 30, 0.92);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
  border-bottom: 1px solid var(--border);
}

.navbar__logo {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-light);
  white-space: nowrap;
}

.navbar__links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
}

.navbar__link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius);
  transition: color var(--transition), background var(--transition);
  letter-spacing: 0.03em;
}

.navbar__link:hover {
  color: var(--text-light);
  background: rgba(255,255,255,0.06);
}

.navbar__link--active {
  color: var(--accent-hover);
}

.navbar__burger {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .navbar__burger { display: block; }

  .navbar__links {
    display: none;
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    background: var(--bg-dark);
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .navbar__links--open { display: flex; }

  .navbar__link { font-size: 1rem; padding: 0.75rem 1rem; }
}
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- Navbar
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css src/test/Navbar.test.jsx
git commit -m "feat: add Navbar with smooth scroll and active section tracking"
```

---

### Task 8: Hero Section

**Files:**
- Create: `src/components/HeroSection.jsx`
- Create: `src/components/HeroSection.css`
- Test: `src/test/HeroSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.siteSettings)` → `{ heroHeadline, heroTagline, goFundMeUrl }`
- Produces: `HeroSection` default export — renders `<section id="home">` with hero image, headline, tagline

- [ ] **Step 1: Write failing test**

```jsx
// src/test/HeroSection.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from '../components/HeroSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')

describe('HeroSection', () => {
  it('renders section with id="home"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<HeroSection />)
    expect(document.getElementById('home')).toBeInTheDocument()
  })

  it('renders headline and tagline from Sanity data', () => {
    useSanityFetch.mockReturnValue({
      data: { heroHeadline: 'We Build Rockets', heroTagline: 'A student rocket project.' },
      loading: false,
    })
    render(<HeroSection />)
    expect(screen.getByText('We Build Rockets')).toBeInTheDocument()
    expect(screen.getByText('A student rocket project.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- HeroSection
```

- [ ] **Step 3: Create `src/components/HeroSection.jsx`**

```jsx
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './HeroSection.css'

export default function HeroSection() {
  const { data } = useSanityFetch(queries.siteSettings)

  return (
    <section id="home" className="hero">
      <img
        className="hero__image"
        src="/placeholder-hero.svg"
        alt="Project Aurelian rocket"
      />
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__headline">
            {data?.heroHeadline || 'Project Aurelian'}
          </h1>
          <p className="hero__tagline">
            {data?.heroTagline || 'A bi-propellant liquid rocket, built from scratch.'}
          </p>
          <a href="#newsletter" className="btn-primary hero__cta">Learn More</a>
        </div>
        <div className="hero__scroll-cue" aria-hidden="true">&#8964;</div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/HeroSection.css`**

```css
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero__overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(10,15,30,0.3) 0%, rgba(10,15,30,0.7) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.hero__content {
  max-width: 800px;
}

.hero__headline {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: var(--text-light);
}

.hero__tagline {
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  color: rgba(248,250,252,0.85);
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.hero__cta {
  font-size: 1.1rem;
  padding: 1rem 2.5rem;
}

.hero__scroll-cue {
  position: absolute;
  bottom: 2rem;
  font-size: 2.5rem;
  color: rgba(248,250,252,0.4);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- HeroSection
```

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroSection.jsx src/components/HeroSection.css src/test/HeroSection.test.jsx
git commit -m "feat: add Hero section with Sanity-driven headline and tagline"
```

---

### Task 9: Newsletter Section + Modal

**Files:**
- Create: `src/components/NewsletterSection.jsx`
- Create: `src/components/NewsletterSection.css`
- Create: `src/components/NewsletterModal.jsx`
- Create: `src/components/NewsletterModal.css`
- Test: `src/test/NewsletterSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.newsletter)` → array of `{ _id, title, month, year, preview, body }`
- Consumes: `urlFor` from `src/lib/sanity` (for body images via PortableText)
- Produces: `NewsletterSection` default export — renders `<section id="newsletter">` with cards and modal

- [ ] **Step 1: Write failing test**

```jsx
// src/test/NewsletterSection.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NewsletterSection from '../components/NewsletterSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { newsletter: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

const MOCK_ENTRIES = [
  { _id: '1', title: 'First Entry', month: 9, year: 2026, preview: 'A great month.', body: [] },
]

describe('NewsletterSection', () => {
  it('renders section with id="newsletter"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<NewsletterSection />)
    expect(document.getElementById('newsletter')).toBeInTheDocument()
  })

  it('renders a card for each newsletter entry', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_ENTRIES, loading: false })
    render(<NewsletterSection />)
    expect(screen.getByText('First Entry')).toBeInTheDocument()
    expect(screen.getByText('A great month.')).toBeInTheDocument()
  })

  it('opens modal when Read More is clicked', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_ENTRIES, loading: false })
    render(<NewsletterSection />)
    fireEvent.click(screen.getByText('Read More'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- NewsletterSection
```

- [ ] **Step 3: Create `src/components/NewsletterModal.jsx`**

```jsx
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import './NewsletterModal.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const ptComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        className="newsletter-modal__image"
      />
    ),
  },
}

export default function NewsletterModal({ entry, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="newsletter-modal__backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="newsletter-modal__panel">
        <button className="newsletter-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <p className="newsletter-modal__date">
          {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
        </p>
        <h2 className="newsletter-modal__title">{entry.title}</h2>
        <div className="newsletter-modal__body">
          {entry.body?.length > 0
            ? <PortableText value={entry.body} components={ptComponents} />
            : <p>Full content coming soon.</p>
          }
        </div>
      </div>
    </div>,
    document.body
  )
}
```

- [ ] **Step 4: Create `src/components/NewsletterModal.css`**

```css
.newsletter-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.newsletter-modal__panel {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  max-width: 760px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2.5rem;
  position: relative;
}

.newsletter-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  transition: color var(--transition);
}

.newsletter-modal__close:hover { color: var(--text-light); }

.newsletter-modal__date {
  font-size: 0.85rem;
  color: var(--accent-hover);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.newsletter-modal__title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.newsletter-modal__body p { margin-bottom: 1rem; color: rgba(248,250,252,0.85); }

.newsletter-modal__image {
  width: 100%;
  border-radius: var(--radius);
  margin: 1.5rem 0;
}
```

- [ ] **Step 5: Create `src/components/NewsletterSection.jsx`**

```jsx
import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import NewsletterModal from './NewsletterModal'
import './NewsletterSection.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function NewsletterSection() {
  const { data: entries, loading } = useSanityFetch(queries.newsletter)
  const [selected, setSelected] = useState(null)

  return (
    <section id="newsletter">
      <div className="section-container">
        <h2 className="section-title">Newsletter</h2>
        <p className="section-subtitle">Monthly updates from the team.</p>

        {loading && <p className="newsletter__loading">Loading entries…</p>}

        {!loading && entries?.length === 0 && (
          <p className="newsletter__empty">First newsletter coming soon. Stay tuned.</p>
        )}

        <div className="newsletter__grid">
          {entries?.map(entry => (
            <article key={entry._id} className="newsletter__card">
              <p className="newsletter__card-date">
                {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
              </p>
              <h3 className="newsletter__card-title">{entry.title}</h3>
              <p className="newsletter__card-preview">{entry.preview}</p>
              <button
                className="btn-primary newsletter__read-more"
                onClick={() => setSelected(entry)}
              >
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <NewsletterModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
```

- [ ] **Step 6: Create `src/components/NewsletterSection.css`**

```css
.newsletter__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.newsletter__card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color var(--transition);
}

.newsletter__card:hover { border-color: var(--accent); }

.newsletter__card-date {
  font-size: 0.8rem;
  color: var(--accent-hover);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.newsletter__card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
}

.newsletter__card-preview {
  color: var(--text-muted);
  font-size: 0.95rem;
  flex: 1;
}

.newsletter__read-more {
  align-self: flex-start;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
}

.newsletter__loading,
.newsletter__empty {
  color: var(--text-muted);
  text-align: center;
  padding: 3rem 0;
}
```

- [ ] **Step 7: Run test — verify it passes**

```bash
npm test -- NewsletterSection
```

- [ ] **Step 8: Commit**

```bash
git add src/components/NewsletterSection.* src/components/NewsletterModal.* src/test/NewsletterSection.test.jsx
git commit -m "feat: add Newsletter section with card grid and read-more modal"
```

---

### Task 10: About Section

**Files:**
- Create: `src/components/AboutSection.jsx`
- Create: `src/components/AboutSection.css`
- Test: `src/test/AboutSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.about)` → `{ body, featureBullets: string[], photo }`
- Consumes: `urlFor` for photo
- Produces: `AboutSection` default export — renders `<section id="about">`

- [ ] **Step 1: Write failing test**

```jsx
// src/test/AboutSection.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AboutSection from '../components/AboutSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { about: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

describe('AboutSection', () => {
  it('renders section with id="about"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<AboutSection />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders feature bullets', () => {
    useSanityFetch.mockReturnValue({
      data: { body: [], featureBullets: ['Bi-propellant engine', 'Custom avionics'], photo: null },
      loading: false,
    })
    render(<AboutSection />)
    expect(screen.getByText('Bi-propellant engine')).toBeInTheDocument()
    expect(screen.getByText('Custom avionics')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- AboutSection
```

- [ ] **Step 3: Create `src/components/AboutSection.jsx`**

```jsx
import { PortableText } from '@portabletext/react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, urlFor } from '../lib/sanity'
import './AboutSection.css'

export default function AboutSection() {
  const { data } = useSanityFetch(queries.about)

  return (
    <section id="about">
      <div className="section-container about__grid">
        <div className="about__text">
          <h2 className="section-title">About Project Aurelian</h2>
          {data?.body?.length > 0
            ? <div className="about__body"><PortableText value={data.body} /></div>
            : <p className="about__placeholder">Project description coming soon.</p>
          }
          {data?.featureBullets?.length > 0 && (
            <ul className="about__bullets">
              {data.featureBullets.map((bullet, i) => (
                <li key={i} className="about__bullet">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="about__photo-wrap">
          <img
            src={data?.photo ? urlFor(data.photo).width(600).url() : '/placeholder-photo.svg'}
            alt="Project Aurelian rocket"
            className="about__photo"
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/AboutSection.css`**

```css
.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about__body p { margin-bottom: 1rem; color: rgba(248,250,252,0.85); }

.about__bullets {
  list-style: none;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.about__bullet {
  padding-left: 1.5rem;
  position: relative;
  color: rgba(248,250,252,0.85);
}

.about__bullet::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--accent-hover);
}

.about__photo {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.about__placeholder { color: var(--text-muted); }

@media (max-width: 768px) {
  .about__grid { grid-template-columns: 1fr; }
  .about__photo-wrap { order: -1; }
}
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- AboutSection
```

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutSection.jsx src/components/AboutSection.css src/test/AboutSection.test.jsx
git commit -m "feat: add About section with PortableText body and feature bullets"
```

---

### Task 11: Rocket Section + Accordion

**Files:**
- Create: `src/components/RocketSection.jsx`
- Create: `src/components/RocketSection.css`
- Create: `src/components/RocketAccordion.jsx`
- Create: `src/components/RocketAccordion.css`
- Test: `src/test/RocketSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.rocketSpecs)` → array of `{ _id, title, body }`
- Produces: `RocketSection` default export — renders `<section id="rocket">` with collapsible accordion

- [ ] **Step 1: Write failing test**

```jsx
// src/test/RocketSection.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RocketSection from '../components/RocketSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({ queries: { rocketSpecs: '' } }))

const MOCK_SPECS = [
  { _id: '1', title: 'Propulsion', body: [{ _type: 'block', children: [{ text: 'Liquid engine details.' }] }] },
  { _id: '2', title: 'Dimensions', body: [] },
]

describe('RocketSection', () => {
  it('renders section with id="rocket"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<RocketSection />)
    expect(document.getElementById('rocket')).toBeInTheDocument()
  })

  it('renders accordion items for each spec', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_SPECS, loading: false })
    render(<RocketSection />)
    expect(screen.getByText('Propulsion')).toBeInTheDocument()
    expect(screen.getByText('Dimensions')).toBeInTheDocument()
  })

  it('expands an accordion item on click', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_SPECS, loading: false })
    render(<RocketSection />)
    fireEvent.click(screen.getByText('Propulsion'))
    expect(screen.getByText('Propulsion').closest('button')).toHaveAttribute('aria-expanded', 'true')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- RocketSection
```

- [ ] **Step 3: Create `src/components/RocketAccordion.jsx`**

```jsx
import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import './RocketAccordion.css'

export default function RocketAccordion({ spec, isOpen, onToggle }) {
  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''}`}>
      <button
        className="accordion__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{spec.title}</span>
        <span className="accordion__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="accordion__body">
        {isOpen && (
          <div className="accordion__content">
            {spec.body?.length > 0
              ? <PortableText value={spec.body} />
              : <p>Content coming soon.</p>
            }
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/RocketAccordion.css`**

```css
.accordion {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color var(--transition);
}

.accordion--open { border-color: var(--accent); }

.accordion__header {
  width: 100%;
  background: var(--card-bg);
  border: none;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-light);
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.04em;
  text-align: left;
  transition: background var(--transition);
}

.accordion__header:hover { background: #1a2540; }

.accordion__icon {
  font-size: 1.25rem;
  color: var(--accent-hover);
  line-height: 1;
}

.accordion__content {
  padding: 1.25rem 1.5rem;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid var(--border);
  color: rgba(248,250,252,0.85);
}

.accordion__content p { margin-bottom: 0.75rem; }
```

- [ ] **Step 5: Create `src/components/RocketSection.jsx`**

```jsx
import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import RocketAccordion from './RocketAccordion'
import './RocketSection.css'

export default function RocketSection() {
  const { data: specs, loading } = useSanityFetch(queries.rocketSpecs)
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <section id="rocket">
      <div className="section-container">
        <h2 className="section-title">The Rocket</h2>
        <p className="section-subtitle">Technical specifications for Project Aurelian.</p>

        {loading && <p className="rocket__loading">Loading specs…</p>}

        <div className="rocket__accordion-list">
          {specs?.map(spec => (
            <RocketAccordion
              key={spec._id}
              spec={spec}
              isOpen={openId === spec._id}
              onToggle={() => toggle(spec._id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `src/components/RocketSection.css`**

```css
.rocket__accordion-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rocket__loading { color: var(--text-muted); text-align: center; padding: 3rem 0; }
```

- [ ] **Step 7: Run test — verify it passes**

```bash
npm test -- RocketSection
```

- [ ] **Step 8: Commit**

```bash
git add src/components/RocketSection.* src/components/RocketAccordion.* src/test/RocketSection.test.jsx
git commit -m "feat: add Rocket section with collapsible accordion specs"
```

---

### Task 12: Timeline Section

**Files:**
- Create: `src/components/TimelineSection.jsx`
- Create: `src/components/TimelineSection.css`
- Test: `src/test/TimelineSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.timeline)` → array of `{ _id, month, year, goals: [{ text, completed }] }`
- Produces: `TimelineSection` default export — renders `<section id="timeline">` with vertical timeline

- [ ] **Step 1: Write failing test**

```jsx
// src/test/TimelineSection.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimelineSection from '../components/TimelineSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({ queries: { timeline: '' } }))

const MOCK_MILESTONES = [
  {
    _id: '1', month: 9, year: 2026,
    goals: [{ text: 'Complete CAD model', completed: true }, { text: 'Order materials', completed: false }],
  },
]

describe('TimelineSection', () => {
  it('renders section with id="timeline"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<TimelineSection />)
    expect(document.getElementById('timeline')).toBeInTheDocument()
  })

  it('renders month label and goals', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MILESTONES, loading: false })
    render(<TimelineSection />)
    expect(screen.getByText(/September 2026/)).toBeInTheDocument()
    expect(screen.getByText('Complete CAD model')).toBeInTheDocument()
    expect(screen.getByText('Order materials')).toBeInTheDocument()
  })

  it('marks completed goals visually', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MILESTONES, loading: false })
    render(<TimelineSection />)
    const completedItem = screen.getByText('Complete CAD model').closest('li')
    expect(completedItem).toHaveClass('timeline__goal--done')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- TimelineSection
```

- [ ] **Step 3: Create `src/components/TimelineSection.jsx`**

```jsx
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './TimelineSection.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function TimelineSection() {
  const { data: milestones, loading } = useSanityFetch(queries.timeline)

  return (
    <section id="timeline">
      <div className="section-container">
        <h2 className="section-title">Project Timeline</h2>
        <p className="section-subtitle">Monthly milestones tracking our progress.</p>

        {loading && <p className="timeline__loading">Loading timeline…</p>}

        <div className="timeline">
          {milestones?.map((milestone, index) => (
            <div key={milestone._id} className="timeline__entry">
              <div className="timeline__connector">
                <div className="timeline__dot" />
                {index < milestones.length - 1 && <div className="timeline__line" />}
              </div>
              <div className="timeline__card">
                <p className="timeline__month">
                  {MONTHS[(milestone.month ?? 1) - 1]} {milestone.year}
                </p>
                <ul className="timeline__goals">
                  {milestone.goals?.map((goal, i) => (
                    <li
                      key={i}
                      className={`timeline__goal ${goal.completed ? 'timeline__goal--done' : ''}`}
                    >
                      <span className="timeline__goal-icon" aria-hidden="true">
                        {goal.completed ? '✓' : '○'}
                      </span>
                      {goal.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/TimelineSection.css`**

```css
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline__entry {
  display: flex;
  gap: 1.5rem;
}

.timeline__connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 0.3rem;
}

.timeline__line {
  width: 2px;
  flex: 1;
  background: var(--border);
  margin: 0.4rem 0;
  min-height: 1.5rem;
}

.timeline__card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.timeline__month {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--accent-hover);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.timeline__goals {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline__goal {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: rgba(248,250,252,0.7);
  font-size: 0.95rem;
}

.timeline__goal--done { color: var(--text-light); }

.timeline__goal-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  font-size: 0.85rem;
  margin-top: 0.1rem;
}

.timeline__goal--done .timeline__goal-icon { color: var(--accent-hover); }

.timeline__loading { color: var(--text-muted); text-align: center; padding: 3rem 0; }
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- TimelineSection
```

- [ ] **Step 6: Commit**

```bash
git add src/components/TimelineSection.jsx src/components/TimelineSection.css src/test/TimelineSection.test.jsx
git commit -m "feat: add Timeline section with milestone tracker"
```

---

### Task 13: Members Section

**Files:**
- Create: `src/components/MembersSection.jsx`
- Create: `src/components/MembersSection.css`
- Create: `src/components/MemberCard.jsx`
- Create: `src/components/MemberCard.css`
- Test: `src/test/MembersSection.test.jsx`

**Interfaces:**
- Consumes: `useSanityFetch(queries.members)` → array of `{ _id, name, role, photo, resumeUrl, bio }`
- Consumes: `urlFor` for member photos
- Produces: `MembersSection` default export — renders `<section id="members">` with 2-column card grid

- [ ] **Step 1: Write failing test**

```jsx
// src/test/MembersSection.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MembersSection from '../components/MembersSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { members: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), height: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

const MOCK_MEMBERS = [
  { _id: '1', name: 'Dylan Irons', role: 'Project Lead', photo: null, resumeUrl: 'https://example.com', bio: 'Builds rockets.' },
]

describe('MembersSection', () => {
  it('renders section with id="members"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<MembersSection />)
    expect(document.getElementById('members')).toBeInTheDocument()
  })

  it('renders a card for each member', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MEMBERS, loading: false })
    render(<MembersSection />)
    expect(screen.getByText('Dylan Irons')).toBeInTheDocument()
    expect(screen.getByText('Project Lead')).toBeInTheDocument()
    expect(screen.getByText('Builds rockets.')).toBeInTheDocument()
  })

  it('renders resume link when provided', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MEMBERS, loading: false })
    render(<MembersSection />)
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', 'https://example.com')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- MembersSection
```

- [ ] **Step 3: Create `src/components/MemberCard.jsx`**

```jsx
import { urlFor } from '../lib/sanity'
import './MemberCard.css'

export default function MemberCard({ member }) {
  return (
    <article className="member-card">
      <img
        src={member.photo ? urlFor(member.photo).width(300).height(300).url() : '/placeholder-photo.svg'}
        alt={member.name}
        className="member-card__photo"
      />
      <div className="member-card__info">
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__role">{member.role}</p>
        {member.bio && <p className="member-card__bio">{member.bio}</p>}
        {member.resumeUrl && (
          <a
            href={member.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="member-card__resume"
          >
            View Resume ↗
          </a>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Create `src/components/MemberCard.css`**

```css
.member-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: flex-start;
  transition: border-color var(--transition);
}

.member-card:hover { border-color: var(--accent); }

.member-card__photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--border);
}

.member-card__info { display: flex; flex-direction: column; gap: 0.4rem; }

.member-card__name {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--text-light);
}

.member-card__role {
  font-size: 0.85rem;
  color: var(--accent-hover);
  letter-spacing: 0.04em;
}

.member-card__bio {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  line-height: 1.6;
}

.member-card__resume {
  font-size: 0.85rem;
  color: var(--accent-hover);
  margin-top: 0.5rem;
  display: inline-block;
}
```

- [ ] **Step 5: Create `src/components/MembersSection.jsx`**

```jsx
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import MemberCard from './MemberCard'
import './MembersSection.css'

export default function MembersSection() {
  const { data: members, loading } = useSanityFetch(queries.members)

  return (
    <section id="members">
      <div className="section-container">
        <h2 className="section-title">The Team</h2>
        <p className="section-subtitle">The people building Project Aurelian.</p>

        {loading && <p className="members__loading">Loading team…</p>}

        <div className="members__grid">
          {members?.map(member => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `src/components/MembersSection.css`**

```css
.members__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.members__loading { color: var(--text-muted); text-align: center; padding: 3rem 0; }

@media (max-width: 768px) {
  .members__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7: Run test — verify it passes**

```bash
npm test -- MembersSection
```

- [ ] **Step 8: Commit**

```bash
git add src/components/MembersSection.* src/components/MemberCard.* src/test/MembersSection.test.jsx
git commit -m "feat: add Members section with 2-column card grid"
```

---

### Task 14: Support Us + Contact + Floating Donate Button

**Files:**
- Create: `src/components/SupportSection.jsx`
- Create: `src/components/SupportSection.css`
- Create: `src/components/ContactSection.jsx`
- Create: `src/components/ContactSection.css`
- Create: `src/components/FloatingDonateButton.jsx`
- Create: `src/components/FloatingDonateButton.css`
- Test: `src/test/SupportSection.test.jsx`

**Interfaces:**
- `SupportSection` consumes: `useSanityFetch(queries.support)` → `{ body, goFundMeUrl, photo }`
- `ContactSection` consumes: `useSanityFetch(queries.contact)` → array of `{ _id, name, role, email, linkedInUrl }`
- `FloatingDonateButton` consumes: `url` prop (string | null) — renders nothing when null
- Produces: Three default exports as above

- [ ] **Step 1: Write failing test**

```jsx
// src/test/SupportSection.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SupportSection from '../components/SupportSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { support: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

describe('SupportSection', () => {
  it('renders section with id="support"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<SupportSection />)
    expect(document.getElementById('support')).toBeInTheDocument()
  })

  it('renders GoFundMe link when URL is present', () => {
    useSanityFetch.mockReturnValue({
      data: { body: [], goFundMeUrl: 'https://gofundme.com/aurelian', photo: null },
      loading: false,
    })
    render(<SupportSection />)
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', 'https://gofundme.com/aurelian')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- SupportSection
```

- [ ] **Step 3: Create `src/components/SupportSection.jsx`**

```jsx
import { PortableText } from '@portabletext/react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, urlFor } from '../lib/sanity'
import './SupportSection.css'

export default function SupportSection() {
  const { data } = useSanityFetch(queries.support)

  return (
    <section id="support">
      <div className="section-container support__inner">
        <img
          src={data?.photo ? urlFor(data.photo).width(1200).url() : '/placeholder-photo.svg'}
          alt="Project Aurelian team"
          className="support__photo"
        />
        <div className="support__content">
          <h2 className="section-title">Support Us</h2>
          <div className="support__body">
            {data?.body?.length > 0
              ? <PortableText value={data.body} />
              : <p>Help us build the future of student rocketry. Every contribution matters.</p>
            }
          </div>
          {data?.goFundMeUrl
            ? (
              <a
                href={data.goFundMeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary support__donate-btn"
              >
                Donate on GoFundMe
              </a>
            )
            : (
              <p className="support__coming-soon">Donation link coming soon.</p>
            )
          }
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/SupportSection.css`**

```css
.support__inner { display: flex; flex-direction: column; gap: 2.5rem; }

.support__photo {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.support__body p { color: rgba(248,250,252,0.85); margin-bottom: 1rem; font-size: 1.05rem; }

.support__donate-btn { font-size: 1.1rem; padding: 1rem 2.5rem; margin-top: 1rem; }

.support__coming-soon { color: var(--text-muted); margin-top: 1rem; }
```

- [ ] **Step 5: Create `src/components/ContactSection.jsx`**

```jsx
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './ContactSection.css'

export default function ContactSection() {
  const { data: contacts } = useSanityFetch(queries.contact)

  return (
    <section id="contact">
      <div className="section-container">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Get in touch with the team.</p>
        <div className="contact__grid">
          {contacts?.map(contact => (
            <div key={contact._id} className="contact__card">
              <h3 className="contact__name">{contact.name}</h3>
              {contact.role && <p className="contact__role">{contact.role}</p>}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="contact__link">
                  {contact.email}
                </a>
              )}
              {contact.linkedInUrl && (
                <a
                  href={contact.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `src/components/ContactSection.css`**

```css
.contact__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.contact__card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact__name {
  font-family: var(--font-heading);
  font-size: 1rem;
}

.contact__role { font-size: 0.85rem; color: var(--accent-hover); }

.contact__link { font-size: 0.9rem; color: var(--accent-hover); display: block; }
.contact__link:hover { color: var(--text-light); }
```

- [ ] **Step 7: Create `src/components/FloatingDonateButton.jsx`**

```jsx
import './FloatingDonateButton.css'

export default function FloatingDonateButton({ url }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-donate"
      aria-label="Donate to Project Aurelian"
    >
      Donate ♥
    </a>
  )
}
```

- [ ] **Step 8: Create `src/components/FloatingDonateButton.css`**

```css
.floating-donate {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  background: var(--accent);
  color: var(--text-light);
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 20px rgba(37,99,235,0.4);
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
  text-decoration: none;
}

.floating-donate:hover {
  background: var(--accent-hover);
  color: var(--text-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(96,165,250,0.4);
  text-decoration: none;
}
```

- [ ] **Step 9: Run test — verify it passes**

```bash
npm test -- SupportSection
```

- [ ] **Step 10: Commit**

```bash
git add src/components/SupportSection.* src/components/ContactSection.* src/components/FloatingDonateButton.* src/test/SupportSection.test.jsx
git commit -m "feat: add Support Us, Contact, and floating Donate button"
```

---

### Task 15: App Assembly + Final Integration

**Files:**
- Modify: `src/App.jsx` (full implementation replacing the shell)
- Create: `src/App.css`

**Interfaces:**
- Consumes: All components from Tasks 7–14
- Consumes: `useSanityFetch(queries.siteSettings)` for GoFundMe URL passed to `FloatingDonateButton`
- Produces: Working single-page app with all sections assembled and `npm run build` passing

- [ ] **Step 1: Write failing test**

```jsx
// src/test/App.test.jsx (replace existing)
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../components/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }))
vi.mock('../components/HeroSection', () => ({ default: () => <section id="home" /> }))
vi.mock('../components/NewsletterSection', () => ({ default: () => <section id="newsletter" /> }))
vi.mock('../components/AboutSection', () => ({ default: () => <section id="about" /> }))
vi.mock('../components/RocketSection', () => ({ default: () => <section id="rocket" /> }))
vi.mock('../components/TimelineSection', () => ({ default: () => <section id="timeline" /> }))
vi.mock('../components/MembersSection', () => ({ default: () => <section id="members" /> }))
vi.mock('../components/SupportSection', () => ({ default: () => <section id="support" /> }))
vi.mock('../components/ContactSection', () => ({ default: () => <section id="contact" /> }))
vi.mock('../components/FloatingDonateButton', () => ({ default: () => <a className="floating-donate" /> }))
vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: '' } }))

import App from '../App'

describe('App', () => {
  it('renders all section ids', () => {
    render(<App />)
    const ids = ['home', 'newsletter', 'about', 'rocket', 'timeline', 'members', 'support', 'contact']
    ids.forEach(id => expect(document.getElementById(id)).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- App
```

- [ ] **Step 3: Replace `src/App.jsx` with full implementation**

```jsx
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import NewsletterSection from './components/NewsletterSection'
import AboutSection from './components/AboutSection'
import RocketSection from './components/RocketSection'
import TimelineSection from './components/TimelineSection'
import MembersSection from './components/MembersSection'
import SupportSection from './components/SupportSection'
import ContactSection from './components/ContactSection'
import FloatingDonateButton from './components/FloatingDonateButton'
import { useSanityFetch } from './hooks/useSanityFetch'
import { queries } from './lib/sanity'
import './App.css'

export default function App() {
  const { data: settings } = useSanityFetch(queries.siteSettings)

  return (
    <>
      <Navbar />
      <main className="app-main">
        <HeroSection />
        <NewsletterSection />
        <AboutSection />
        <RocketSection />
        <TimelineSection />
        <MembersSection />
        <SupportSection />
        <ContactSection />
      </main>
      <FloatingDonateButton url={settings?.goFundMeUrl} />
    </>
  )
}
```

- [ ] **Step 4: Create `src/App.css`**

```css
.app-main {
  padding-top: var(--navbar-height);
}
```

- [ ] **Step 5: Run full test suite**

```bash
npm test
```
Expected: All tests pass

- [ ] **Step 6: Verify full site in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Navbar is sticky and logo reads `PROJECT AURELIAN`
- Clicking each nav link smooth-scrolls to that section
- Hero displays placeholder image and fallback headline
- Newsletter shows empty state or placeholder entries from Sanity
- About, Rocket, Timeline, Members, Support, Contact sections all render
- Floating donate button is hidden (no GoFundMe URL yet — that's expected)
- No console errors

- [ ] **Step 7: Verify production build**

```bash
npm run build
```
Expected: `dist/` created, no errors or warnings about missing modules.

- [ ] **Step 8: Final commit and push**

```bash
git add src/App.jsx src/App.css src/test/App.test.jsx
git commit -m "feat: assemble full single-page app with all sections wired"
git push origin main
```

- [ ] **Step 9: Verify GitHub Actions deploys successfully**

Go to the GitHub repo → Actions tab. The deploy workflow should run and succeed. After ~2 minutes the site should be live at `https://<username>.github.io/RocketSite/` (or custom domain once configured).

---

## Deployment Checklist (post-implementation)

- [ ] Sanity Studio deployed: run `cd studio && npx sanity deploy` — choose a studio hostname (e.g. `project-aurelian`)
- [ ] Invite team members to Sanity Studio: https://sanity.io/manage → your project → Members → Invite
- [ ] Add all real content in Sanity Studio (replace placeholders)
- [ ] Set GoFundMe URL in Site Settings → floating donate button will appear automatically
- [ ] Purchase domain and configure in GitHub Pages Settings → Custom domain
- [ ] Add `CNAME` file in `public/` with domain name (e.g. `projectaurelian.com`) so GitHub Pages preserves it on redeploy
