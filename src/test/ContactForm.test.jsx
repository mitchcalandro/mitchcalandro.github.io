import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const mockUseForm = vi.fn()
vi.mock('@formspree/react', () => ({
  useForm: (...args) => mockUseForm(...args),
  ValidationError: () => null,
}))

import ContactForm from '../components/ContactForm'

const state = (over = {}) => [{ succeeded: false, submitting: false, errors: null, ...over }, vi.fn()]

describe('ContactForm', () => {
  it('renders name, email, and message fields wired to the given form id', () => {
    mockUseForm.mockReturnValue(state())
    render(<ContactForm formspreeId="xrpgrlkb" />)
    expect(mockUseForm).toHaveBeenCalledWith('xrpgrlkb')
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('shows a thank-you message on success', () => {
    mockUseForm.mockReturnValue(state({ succeeded: true }))
    render(<ContactForm formspreeId="xrpgrlkb" />)
    expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /send/i })).not.toBeInTheDocument()
  })

  it('disables the button and shows progress while submitting', () => {
    mockUseForm.mockReturnValue(state({ submitting: true }))
    render(<ContactForm formspreeId="xrpgrlkb" />)
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('shows an error message when submission fails', () => {
    mockUseForm.mockReturnValue(state({ errors: [{ message: 'nope' }] }))
    render(<ContactForm formspreeId="xrpgrlkb" />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders nothing without a form id', () => {
    mockUseForm.mockReturnValue(state())
    const { container } = render(<ContactForm formspreeId="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
