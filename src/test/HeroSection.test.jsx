import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from '../components/HeroSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')

describe('HeroSection', () => {
  it('renders section with id="home"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<HeroSection />)
    expect(document.getElementById('home')).toBeInTheDocument()
  })

  it('renders headline and tagline from Sanity data', () => {
    useSanityFetch.mockReturnValue({
      data: { heroHeadline: 'We Build Rockets', heroTagline: 'A student rocket project.' },
      loading: false,
    })
    render(<HeroSection />)
    expect(screen.getByText('We Build Rockets')).toBeInTheDocument()
    expect(screen.getByText('A student rocket project.')).toBeInTheDocument()
  })
})
