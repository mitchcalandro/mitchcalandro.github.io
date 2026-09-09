import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's', contact: 'c' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))
vi.mock('../components/ContactForm', () => ({ default: ({ formspreeId }) => <form data-testid="contact-form" data-form-id={formspreeId} /> }))

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
    mockFetch(null)
    render(<ContactPage />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByText('Mitchell Calandro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /scottdmeesonjr@gmail.com/i }))
      .toHaveAttribute('href', 'mailto:scottdmeesonjr@gmail.com')
  })

  it('renders one form using the built-in form id when Sanity has none', () => {
    mockFetch(null)
    render(<ContactPage />)
    const forms = screen.getAllByTestId('contact-form')
    expect(forms).toHaveLength(1)
    expect(forms[0]).toHaveAttribute('data-form-id', 'xrpgrlkb')
  })

  it('lets Sanity override the form id', () => {
    mockFetch({ formspreeId: 'override1' })
    render(<ContactPage />)
    expect(screen.getByTestId('contact-form')).toHaveAttribute('data-form-id', 'override1')
  })

  it('shows an empty state when there are no contacts', () => {
    mockFetch(null, [])
    render(<ContactPage />)
    expect(screen.getByText(/contact details coming soon/i)).toBeInTheDocument()
  })
})
