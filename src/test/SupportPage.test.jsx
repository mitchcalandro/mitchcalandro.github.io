import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { support: 's' }, urlFor: () => ({ width: () => ({ url: () => '' }) }) }))

import SupportPage from '../pages/SupportPage'

describe('SupportPage', () => {
  it('uses the campaign url from Sanity when it is set', () => {
    useSanityFetch.mockReturnValue({ data: { body: [], goFundMeUrl: 'https://gofundme.com/f/aurelian' }, loading: false })
    render(<SupportPage />)
    expect(screen.getByRole('link', { name: /donate/i }))
      .toHaveAttribute('href', 'https://gofundme.com/f/aurelian')
  })

  it('falls back to the GoFundMe site so the button is never dead', () => {
    useSanityFetch.mockReturnValue({ data: { body: [], goFundMeUrl: null }, loading: false })
    render(<SupportPage />)
    expect(screen.getByRole('link', { name: /donate/i }))
      .toHaveAttribute('href', 'https://www.gofundme.com')
  })
})
