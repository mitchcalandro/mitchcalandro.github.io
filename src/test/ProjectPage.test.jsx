import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's', phases: 'p', members: 'm' }, fullImageUrl: () => '/img.jpg' }))
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

  it('places project images where the Studio says, defaulting older images to full width', () => {
    const projectBody = [
      { _type: 'image', _key: 'a', asset: { _ref: 'image-a' }, position: 'left', size: 'small', caption: 'Test stand' },
      { _type: 'image', _key: 'b', asset: { _ref: 'image-b' }, alt: 'Engine' },
    ]
    useSanityFetch.mockImplementation((q) => ({ data: q === 's' ? { projectBody } : null, loading: false }))
    render(<MemoryRouter><ProjectPage /></MemoryRouter>)
    expect(screen.getByAltText('Test stand').closest('figure')).toHaveClass('project__figure--left', 'project__figure--small')
    expect(screen.getByText('Test stand').tagName).toBe('FIGCAPTION')
    expect(screen.getByAltText('Engine').closest('figure')).toHaveClass('project__figure--full')
  })

  it('lays a Columns block out side by side, one column per entry', () => {
    const para = (k, text) => ({ _type: 'block', _key: k, children: [{ _type: 'span', _key: k + 's', text }] })
    const projectBody = [{ _type: 'columns', _key: 'c', columns: [
      { _key: 'c1', body: [para('a', 'Left column')] },
      { _key: 'c2', body: [para('b', 'Right column'), { _type: 'image', _key: 'i', asset: { _ref: 'image-x' }, alt: 'Valve' }] },
    ] }]
    useSanityFetch.mockImplementation((q) => ({ data: q === 's' ? { projectBody } : null, loading: false }))
    const { container } = render(<MemoryRouter><ProjectPage /></MemoryRouter>)
    const grid = container.querySelector('.project__columns')
    expect(grid.style.getPropertyValue('--cols')).toBe('2')
    expect(grid.children[0]).toHaveTextContent('Left column')
    expect(grid.children[1]).toHaveTextContent('Right column')
    expect(grid.children[1]).toContainElement(screen.getByAltText('Valve'))
  })
})
