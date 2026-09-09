import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import Footer from '../components/Footer'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's' } }))

describe('Footer', () => {
  it('renders last updated and copyright with settings', () => {
    useSanityFetch.mockReturnValue({ data: { lastUpdated: '2026-09-08', footerText: 'Project Aurelian' }, loading: false })
    render(<Footer />)
    expect(screen.getByText(/last updated/i)).toHaveTextContent('2026-09-08')
    expect(screen.getByText(/© 2026 Project Aurelian/)).toBeInTheDocument()
  })

  it('renders gracefully with no settings', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: false })
    render(<Footer />)
    expect(screen.getByText(/© 2026 Project Aurelian/)).toBeInTheDocument()
  })
})
