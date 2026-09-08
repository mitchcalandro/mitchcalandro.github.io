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
