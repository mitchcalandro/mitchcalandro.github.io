import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { contact: 'c' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))

import ContactPage from '../pages/ContactPage'

const contacts = [
  { _id: 'c1', name: 'Scott Meeson', role: 'Lead Engineer', email: 'scottdmeesonjr@gmail.com' },
  { _id: 'c2', name: 'Mitchell Calandro', role: 'Project Manager', email: 'mitchelldcalandro@gmail.com' },
]

describe('ContactPage', () => {
  it('renders a card per contact with a personal email link', () => {
    useSanityFetch.mockReturnValue({ data: contacts, loading: false })
    render(<ContactPage />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByText('Mitchell Calandro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /scottdmeesonjr@gmail.com/i }))
      .toHaveAttribute('href', 'mailto:scottdmeesonjr@gmail.com')
  })

  it('renders one Contact Us button addressed to every contact at once', () => {
    useSanityFetch.mockReturnValue({ data: contacts, loading: false })
    render(<ContactPage />)
    const btn = screen.getByRole('link', { name: /contact us/i })
    expect(btn).toHaveAttribute(
      'href',
      'mailto:scottdmeesonjr@gmail.com,mitchelldcalandro@gmail.com?subject=Project%20Aurelian%20Inquiry'
    )
  })

  it('omits the Contact Us button when no contacts have emails', () => {
    useSanityFetch.mockReturnValue({ data: [{ _id: 'c3', name: 'No Email', role: 'X' }], loading: false })
    render(<ContactPage />)
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
  })

  it('shows an empty state when there are no contacts', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<ContactPage />)
    expect(screen.getByText(/contact details coming soon/i)).toBeInTheDocument()
  })
})
