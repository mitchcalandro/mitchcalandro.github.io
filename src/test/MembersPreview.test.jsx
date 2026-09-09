import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import MembersPreview from '../components/MembersPreview'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { members: 'm' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))

describe('MembersPreview', () => {
  it('renders member names and a see-more link', () => {
    useSanityFetch.mockReturnValue({ data: [{ _id: 'm1', name: 'Scott Meeson', photo: null }], loading: false })
    render(<MemoryRouter><MembersPreview /></MemoryRouter>)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /see more/i })).toHaveAttribute('href', '/members')
  })
})
