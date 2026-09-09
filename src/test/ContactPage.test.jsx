import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's', contact: 'c' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))
vi.mock('../components/ContactForm', () => ({ default: ({ formspreeId }) => formspreeId ? <form data-testid="contact-form" /> : null }))

import ContactPage from '../pages/ContactPage'

const contacts = [
  { _id: 'c1', name: 'Scott Meeson', role: 'Lead Engineer', email: 'scottdmeesonjr@gmail.com' },
  { _id: 'c2', name: 'Mitchell Calandro', role: 'Project Manager', email: 'mitchelldcalandro@gmail.com' },
]

const mockFetch = (settings, contactData = contacts) =>
  useSanityFetch.mockImplementation((q) =>
    q === 's' ? { data: settings, loading: false } : { data: contactData, loading: false })

describe('ContactPage', () => {
  it('renders a card per contact with a personal email link', () => {
    mockFetch({ formspreeId: 'abc' })
    render(<ContactPage />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByText('Mitchell Calandro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /scottdmeesonjr@gmail.com/i }))
      .toHaveAttribute('href', 'mailto:scottdmeesonjr@gmail.com')
  })

  it('renders one form when a formspreeId is configured', () => {
    mockFetch({ formspreeId: 'abc' })
    render(<ContactPage />)
    expect(screen.getAllByTestId('contact-form')).toHaveLength(1)
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
  })

  it('falls back to a mailto button when no formspreeId is set', () => {
    mockFetch({ formspreeId: null })
    render(<ContactPage />)
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute(
      'href',
      'mailto:scottdmeesonjr@gmail.com,mitchelldcalandro@gmail.com?subject=Project%20Aurelian%20Inquiry'
    )
  })

  it('shows an empty state when there are no contacts', () => {
    mockFetch({ formspreeId: null }, [])
    render(<ContactPage />)
    expect(screen.getByText(/contact details coming soon/i)).toBeInTheDocument()
  })
})
