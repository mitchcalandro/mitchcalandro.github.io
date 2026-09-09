import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { members: 'm' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))

import MembersPage from '../pages/MembersPage'

describe('MembersPage', () => {
  it('renders a card per member', () => {
    useSanityFetch.mockReturnValue({ data: [
      { _id: 'm1', name: 'Scott Meeson', role: 'Lead Engineer', photo: null },
      { _id: 'm2', name: 'Mitchell Calandro', role: 'Project Manager', photo: null },
    ], loading: false })
    render(<MembersPage />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByText('Mitchell Calandro')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<MembersPage />)
    expect(screen.getByText(/team roster coming soon/i)).toBeInTheDocument()
  })
})
