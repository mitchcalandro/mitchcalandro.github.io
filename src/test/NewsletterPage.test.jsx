import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { newsletter: 'n' }, urlFor: () => ({ width: () => ({ url: () => '' }) }) }))

import NewsletterPage from '../pages/NewsletterPage'

describe('NewsletterPage', () => {
  it('renders a featured card and opens the modal', () => {
    useSanityFetch.mockReturnValue({ data: [
      { _id: 'n1', title: 'March', month: 3, year: 2026, preview: 'p', body: [] },
      { _id: 'n2', title: 'February', month: 2, year: 2026, preview: 'p', body: [] },
    ], loading: false })
    const { container } = render(<NewsletterPage />)
    expect(container.querySelector('.newsletter-card--featured')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: /read more/i })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows empty state when there are no newsletters', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<NewsletterPage />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
