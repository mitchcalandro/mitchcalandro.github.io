import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const mockUseForm = vi.fn()
vi.mock('@formspree/react', () => ({
  useForm: (...args) => mockUseForm(...args),
  ValidationError: () => null,
}))

import ContactForm from '../components/ContactForm'

describe('ContactForm', () => {
  it('renders fields when given a formspreeId', () => {
    mockUseForm.mockReturnValue([{ succeeded: false, submitting: false, errors: null }, vi.fn()])
    render(<ContactForm formspreeId="abcd1234" />)
    expect(mockUseForm).toHaveBeenCalledWith('abcd1234')
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('shows a thank-you message on success', () => {
    mockUseForm.mockReturnValue([{ succeeded: true, submitting: false, errors: null }, vi.fn()])
    render(<ContactForm formspreeId="abcd1234" />)
    expect(screen.getByText(/thank you/i)).toBeInTheDocument()
  })

  it('renders nothing without a formspreeId', () => {
    mockUseForm.mockReturnValue([{ succeeded: false, submitting: false, errors: null }, vi.fn()])
    const { container } = render(<ContactForm formspreeId="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
