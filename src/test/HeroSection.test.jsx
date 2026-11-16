import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from '../components/HeroSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({
  queries: { siteSettings: 's', phases: 'p', members: 'm' },
  croppedImageUrl: () => '/hero.jpg',
}))

describe('HeroSection', () => {
  it('renders section with id="home"', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(document.getElementById('home')).toBeInTheDocument()
  })

  it('shows the logo and Our beginnings only once they are filled in', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    const { unmount } = render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.queryByAltText('Project Aurelian logo')).not.toBeInTheDocument()
    expect(screen.queryByText('Our beginnings')).not.toBeInTheDocument()
    unmount()

    useSanityFetch.mockReturnValue({
      data: { logo: { asset: { _ref: 'image-2' } }, whoWeAre: 'Students.', ourBeginnings: 'It started in a garage.' },
      loading: false,
    })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByAltText('Project Aurelian logo')).toBeInTheDocument()
    expect(screen.getByText('Students.')).toBeInTheDocument()
    expect(screen.getByText('It started in a garage.')).toBeInTheDocument()
  })

  it('shows the current phase, progress through the phases and team size', () => {
    const data = {
      s: { currentPhase: { _id: 'p2', name: 'Phase 2 - Testing' } },
      p: [{ _id: 'p1' }, { _id: 'p2' }, { _id: 'p3' }, { _id: 'p4' }],
      m: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
    }
    useSanityFetch.mockImplementation((q) => ({ data: data[q], loading: false }))
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Phase 2 - Testing' })).toHaveAttribute('href', '/project')
    expect(screen.getByText('2 of 4 phases')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '3 members' })).toHaveAttribute('href', '/members')
    useSanityFetch.mockReset()
  })

  it('hides the status strip until there is something to show', () => {
    useSanityFetch.mockReturnValue({ data: null, loading: true })
    const { container } = render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(container.querySelector('.hero__status')).not.toBeInTheDocument()
  })

  it('renders headline and tagline from Sanity data', () => {
    useSanityFetch.mockReturnValue({
      data: { heroHeadline: 'We Build Rockets', heroTagline: 'A student rocket project.' },
      loading: false,
    })
    render(<MemoryRouter><HeroSection /></MemoryRouter>)
    expect(screen.getByText('We Build Rockets')).toBeInTheDocument()
    expect(screen.getByText('A student rocket project.')).toHaveClass('hero__tagline')
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
