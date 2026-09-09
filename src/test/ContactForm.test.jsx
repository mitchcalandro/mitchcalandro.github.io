import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContactForm from '../components/ContactForm'

const fill = () => {
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ada' } })
  fireEvent.change(screen.getByLabelText(/your email/i), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there.' } })
}

describe('ContactForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('renders name, email, and message fields', () => {
    render(<ContactForm accessKey="key-123" />)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('posts the access key and field values to the Web3Forms API', async () => {
    global.fetch.mockResolvedValue({ json: async () => ({ success: true }) })
    render(<ContactForm accessKey="key-123" />)
    fill()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    const [url, opts] = global.fetch.mock.calls[0]
    expect(url).toBe('https://api.web3forms.com/submit')
    const body = JSON.parse(opts.body)
    expect(body.access_key).toBe('key-123')
    expect(body.name).toBe('Ada')
    expect(body.email).toBe('ada@example.com')
    expect(body.message).toBe('Hello there.')
  })

  it('shows a thank-you message on success', async () => {
    global.fetch.mockResolvedValue({ json: async () => ({ success: true }) })
    render(<ContactForm accessKey="key-123" />)
    fill()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByText(/thank you/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /send/i })).not.toBeInTheDocument()
  })

  it('shows an error message when the API reports failure', async () => {
    global.fetch.mockResolvedValue({ json: async () => ({ success: false, message: 'nope' }) })
    render(<ContactForm accessKey="key-123" />)
    fill()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('shows an error message when the request throws', async () => {
    global.fetch.mockRejectedValue(new Error('offline'))
    render(<ContactForm accessKey="key-123" />)
    fill()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders nothing without an access key', () => {
    const { container } = render(<ContactForm accessKey="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
