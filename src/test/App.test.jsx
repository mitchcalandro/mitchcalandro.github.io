import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../components/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }))
vi.mock('../components/HeroSection', () => ({ default: () => <section id="home" /> }))
vi.mock('../components/NewsletterSection', () => ({ default: () => <section id="newsletter" /> }))
vi.mock('../components/AboutSection', () => ({ default: () => <section id="about" /> }))
vi.mock('../components/RocketSection', () => ({ default: () => <section id="rocket" /> }))
vi.mock('../components/TimelineSection', () => ({ default: () => <section id="timeline" /> }))
vi.mock('../components/MembersSection', () => ({ default: () => <section id="members" /> }))
vi.mock('../components/SupportSection', () => ({ default: () => <section id="support" /> }))
vi.mock('../components/ContactSection', () => ({ default: () => <section id="contact" /> }))
vi.mock('../components/FloatingDonateButton', () => ({ default: () => <a className="floating-donate" /> }))
vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: '' } }))

import App from '../App'

describe('App', () => {
  it('renders all section ids', () => {
    render(<App />)
    const ids = ['home', 'newsletter', 'about', 'rocket', 'timeline', 'members', 'support', 'contact']
    ids.forEach(id => expect(document.getElementById(id)).toBeInTheDocument())
  })
})
