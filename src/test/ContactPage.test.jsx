import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { contact: 'c' }, urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))
vi.mock('../components/ContactForm', () => ({ default: ({ formspreeId }) => formspreeId ? <form data-testid="contact-form" /> : null }))

import ContactPage from '../pages/ContactPage'

describe('ContactPage', () => {
  it('renders a card per contact with email link', () => {
    useSanityFetch.mockReturnValue({ data: [
      { _id: 'c1', name: 'Scott Meeson', role: 'Lead Engineer', email: 'scottdmeesonjr@gmail.com', formspreeId: 'abc' },
      { _id: 'c2', name: 'Mitchell Calandro', role: 'Project Manager', email: 'mitchelldcalandro@gmail.com', formspreeId: '' },
    ], loading: false })
    render(<ContactPage />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /scottdmeesonjr@gmail.com/i })).toHaveAttribute('href', 'mailto:scottdmeesonjr@gmail.com')
    expect(screen.getAllByTestId('contact-form')).toHaveLength(1) // only Scott has a formspreeId
  })
})
