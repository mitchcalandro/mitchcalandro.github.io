import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import MembersPreview from '../components/MembersPreview'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { members: 'm' }, croppedImageUrl: () => '/p.svg' }))

describe('MembersPreview', () => {
  it('renders member names and a see-more link', () => {
    useSanityFetch.mockReturnValue({ data: [{ _id: 'm1', name: 'Scott Meeson', photo: null }], loading: false })
    render(<MemoryRouter><MembersPreview /></MemoryRouter>)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /see more/i })).toHaveAttribute('href', '/members')
  })

  it('lists leadership first, then leads, then members, keeping display order within a tier', () => {
    useSanityFetch.mockReturnValue({ data: [
      { _id: 'a', name: 'Member One', tier: 3 },
      { _id: 'b', name: 'Lead One', tier: 2 },
      { _id: 'c', name: 'Boss One', tier: 1 },
      { _id: 'd', name: 'Member Two', tier: 'member' },
      { _id: 'e', name: 'Boss Two', tier: 'leadership' },
    ], loading: false })
    render(<MemoryRouter><MembersPreview /></MemoryRouter>)
    const names = screen.getAllByRole('link').filter((a) => a.getAttribute('href') !== '/members').map((a) => a.textContent)
    expect(names).toEqual(['Boss One', 'Boss Two', 'Lead One', 'Member One', 'Member Two'])
  })

  it("links each photo to that person's card on the Members page", () => {
    useSanityFetch.mockReturnValue({ data: [{ _id: 'm1', name: 'Scott Meeson', photo: null }], loading: false })
    render(<MemoryRouter><MembersPreview /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Scott Meeson' })).toHaveAttribute('href', '/members#m1')
  })
})
