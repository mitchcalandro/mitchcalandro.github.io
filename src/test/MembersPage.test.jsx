import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { members: 'm' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))

import MembersPage from '../pages/MembersPage'

const roster = [
  { _id: 'm1', name: 'Scott Meeson', role: 'Lead Engineer', tier: 'leadership' },
  { _id: 'm2', name: 'Mitchell Calandro', role: 'Project Manager', tier: 'leadership' },
  { _id: 'm3', name: 'Pat Propulsion', role: 'Propulsion Lead', tier: 'lead' },
  { _id: 'm4', name: 'Avery Avionics', role: 'Avionics Lead', tier: 'lead' },
  { _id: 'm5', name: 'Gene General', role: 'Member', tier: 'member' },
]

describe('MembersPage', () => {
  it('renders every member on the roster', () => {
    useSanityFetch.mockReturnValue({ data: roster, loading: false })
    render(<MembersPage />)
    roster.forEach((m) => expect(screen.getByText(m.name)).toBeInTheDocument())
  })

  it('gives leadership the featured size and leads the middle size', () => {
    useSanityFetch.mockReturnValue({ data: roster, loading: false })
    const { container } = render(<MembersPage />)
    expect(container.querySelectorAll('.member-card--leadership')).toHaveLength(2)
    expect(container.querySelectorAll('.member-card--lead')).toHaveLength(2)
    expect(container.querySelectorAll('.member-card--member')).toHaveLength(1)
  })

  it('puts leadership above the other tiers in the document', () => {
    useSanityFetch.mockReturnValue({ data: roster, loading: false })
    const { container } = render(<MembersPage />)
    const cards = [...container.querySelectorAll('.member-card')]
    const names = cards.map((c) => c.querySelector('.member-card__name').textContent)
    expect(names.slice(0, 2)).toEqual(['Scott Meeson', 'Mitchell Calandro'])
    expect(names.at(-1)).toBe('Gene General')
  })

  it('treats a member with no tier as a general member so nobody disappears', () => {
    useSanityFetch.mockReturnValue({ data: [{ _id: 'x', name: 'Untagged Person', role: 'Builder' }], loading: false })
    const { container } = render(<MembersPage />)
    expect(screen.getByText('Untagged Person')).toBeInTheDocument()
    expect(container.querySelectorAll('.member-card--member')).toHaveLength(1)
  })

  it('omits a tier section entirely when it has no members', () => {
    useSanityFetch.mockReturnValue({ data: [roster[0]], loading: false })
    const { container } = render(<MembersPage />)
    expect(container.querySelector('.members-page__tier--leadership')).toBeInTheDocument()
    expect(container.querySelector('.members-page__tier--lead')).not.toBeInTheDocument()
    expect(container.querySelector('.members-page__tier--member')).not.toBeInTheDocument()
  })

  it('shows empty state', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<MembersPage />)
    expect(screen.getByText(/team roster coming soon/i)).toBeInTheDocument()
  })
})
