import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SupportSection from '../components/SupportSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { support: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

describe('SupportSection', () => {
  it('renders section with id="support"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<SupportSection />)
    expect(document.getElementById('support')).toBeInTheDocument()
  })

  it('renders GoFundMe link when URL is present', () => {
    useSanityFetch.mockReturnValue({
      data: { body: [], goFundMeUrl: 'https://gofundme.com/aurelian', photo: null },
      loading: false,
    })
    render(<SupportSection />)
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', 'https://gofundme.com/aurelian')
  })
})
