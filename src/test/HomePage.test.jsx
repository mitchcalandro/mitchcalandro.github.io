import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null, loading: false })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: '', newsletterRecent: '', phases: '', faqs: '' }, urlFor: () => ({ width: () => ({ url: () => '' }) }) }))
vi.mock('../components/PhaseTimeline', () => ({ default: () => <div data-testid="phase-timeline" /> }))
vi.mock('../components/FaqAccordion', () => ({ default: () => <div data-testid="faq" /> }))

import HomePage from '../pages/HomePage'

describe('HomePage', () => {
  it('renders hero, phase timeline, newsletter section, and FAQ', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByTestId('phase-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('faq')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /read past issues/i })).toHaveAttribute('href', '/newsletter')
  })
})
