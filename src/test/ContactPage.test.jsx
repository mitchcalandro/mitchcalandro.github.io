import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's', contact: 'c' }, fullImageUrl: () => '/img.jpg', urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))
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
    expect(forms[0]).toHaveAttribute('data-form-id', 'xyeeeykj')
  })

  it('lets Sanity override the form id', () => {
    mockFetch({ formspreeId: 'override1' })
    render(<ContactPage />)
    expect(screen.getByTestId('contact-form')).toHaveAttribute('data-form-id', 'override1')
  })

  it('links the interest form box to the built-in Google Form unless Sanity has another link', () => {
    mockFetch(null)
    const { unmount } = render(<ContactPage />)
    expect(screen.getByRole('link', { name: /interest form/i })).toHaveAttribute('href', expect.stringContaining('docs.google.com/forms'))
    unmount()
    mockFetch({ interestFormUrl: 'https://forms.example.com/join' })
    render(<ContactPage />)
    expect(screen.getByRole('link', { name: /interest form/i })).toHaveAttribute('href', 'https://forms.example.com/join')
  })

  it('puts the photo and interest form beside the message form once a photo is set', () => {
    mockFetch({})
    const { container, unmount } = render(<ContactPage />)
    expect(container.querySelector('.contact-page__main')).toBeNull()
    unmount()

    mockFetch({ contactPhoto: { asset: { _ref: 'image-c' }, caption: 'At the bench' } })
    render(<ContactPage />)
    const side = screen.getByAltText('At the bench').closest('.contact-page__side')
    expect(side).toContainElement(screen.getByRole('link', { name: /interest form/i }))
    expect(side.parentElement).toContainElement(screen.getByTestId('contact-form'))
  })

  it('shows an empty state when there are no contacts', () => {
    mockFetch(null, [])
    render(<ContactPage />)
    expect(screen.getByText(/contact details coming soon/i)).toBeInTheDocument()
  })
})
