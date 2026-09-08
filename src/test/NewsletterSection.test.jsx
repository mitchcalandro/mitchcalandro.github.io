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
