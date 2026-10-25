import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from '../components/HeroSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { siteSettings: 's' },
  urlFor: () => ({ width: () => ({ url: () => '/hero.jpg' }) }),
}))

describe('HeroSection', () => {
  it('renders section with id="home"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(document.getElementById('home')).toBeInTheDocument()
  })

  it('renders headline and tagline from Sanity data', () => {
    useSanityFetch.mockReturnValue({
      data: { heroHeadline: 'We Build Rockets', heroTagline: 'A student rocket project.' },
      loading: false,
    })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByText('We Build Rockets')).toBeInTheDocument()
    expect(screen.getByText('A student rocket project.')).toBeInTheDocument()
  })

  it('uses the Sanity hero image when one is uploaded', () => {
    useSanityFetch.mockReturnValue({ data: { heroImage: { asset: { _ref: 'image-1' } } }, loading: false })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByAltText('Project Aurelian rocket')).toHaveAttribute('src', '/hero.jpg')
  })

  it('falls back to the plain placeholder background without a hero image', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByAltText('Project Aurelian rocket')).toHaveAttribute('src', '/placeholder-hero.svg')
  })
})
