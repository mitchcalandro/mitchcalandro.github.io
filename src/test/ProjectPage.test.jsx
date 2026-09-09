import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: '', phases: '', members: '' } }))
vi.mock('../components/PhaseTimeline', () => ({ default: () => <div data-testid="phase-timeline" /> }))
vi.mock('../components/MembersPreview', () => ({ default: () => <div data-testid="members-preview" /> }))

import ProjectPage from '../pages/ProjectPage'

describe('ProjectPage', () => {
  it('renders phase cards, timeline, and members preview', () => {
    useSanityFetch.mockImplementation(() => ({ data: null, loading: false }))
    render(<MemoryRouter><ProjectPage /></MemoryRouter>)
    expect(screen.getByTestId('phase-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('members-preview')).toBeInTheDocument()
  })
})
