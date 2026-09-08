import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AboutSection from '../components/AboutSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { about: '' },
  urlFor: vi.fn(() => ({ width: vi.fn().mockReturnThis(), url: vi.fn().mockReturnValue('/test.jpg') })),
}))

describe('AboutSection', () => {
  it('renders section with id="about"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<AboutSection />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders feature bullets', () => {
    useSanityFetch.mockReturnValue({
      data: { body: [], featureBullets: ['Bi-propellant engine', 'Custom avionics'], photo: null },
      loading: false,
    })
    render(<AboutSection />)
    expect(screen.getByText('Bi-propellant engine')).toBeInTheDocument()
    expect(screen.getByText('Custom avionics')).toBeInTheDocument()
  })
})
