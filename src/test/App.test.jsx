import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../components/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }))
vi.mock('../components/Footer', () => ({ default: () => <footer data-testid="footer" /> }))
vi.mock('../components/FloatingDonateButton', () => ({ default: () => <a className="floating-donate" /> }))
vi.mock('../pages/HomePage', () => ({ default: () => <main data-testid="page-home" /> }))
vi.mock('../pages/ProjectPage', () => ({ default: () => <main data-testid="page-project" /> }))
vi.mock('../pages/NewsletterPage', () => ({ default: () => <main data-testid="page-newsletter" /> }))
vi.mock('../pages/MembersPage', () => ({ default: () => <main data-testid="page-members" /> }))
vi.mock('../pages/SupportPage', () => ({ default: () => <main data-testid="page-support" /> }))
vi.mock('../pages/GalleryPage', () => ({ default: () => <main data-testid="page-gallery" /> }))
vi.mock('../pages/ContactPage', () => ({ default: () => <main data-testid="page-contact" /> }))
vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: '' } }))

import App from '../App'

describe('App', () => {
  it('renders navbar, footer, and home page at /', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('page-home')).toBeInTheDocument()
  })

  it('renders the newsletter page at /newsletter', () => {
    render(<MemoryRouter initialEntries={['/newsletter']}><App /></MemoryRouter>)
    expect(screen.getByTestId('page-newsletter')).toBeInTheDocument()
  })
})
