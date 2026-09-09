import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { support: 's' }, urlFor: () => ({ width: () => ({ url: () => '' }) }) }))

import SupportPage from '../pages/SupportPage'

describe('SupportPage', () => {
  it('renders a GoFundMe button when url is present', () => {
    useSanityFetch.mockReturnValue({ data: { body: [], goFundMeUrl: 'https://gofundme.com/x', photo: null }, loading: false })
    render(<SupportPage />)
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', 'https://gofundme.com/x')
  })

  it('shows fallback when no url', () => {
    useSanityFetch.mockReturnValue({ data: { body: [], goFundMeUrl: null }, loading: false })
    render(<SupportPage />)
    expect(screen.getByText(/donation link coming soon/i)).toBeInTheDocument()
  })
})
