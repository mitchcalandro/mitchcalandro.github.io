import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import FaqAccordion from '../components/FaqAccordion'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { faqs: 'faqs' } }))

describe('FaqAccordion', () => {
  it('renders questions and expands answer on click', () => {
    useSanityFetch.mockReturnValue({ data: [
      { _id: 'f1', question: 'What is the project about?', answer: [{ _type: 'block', _key: 'a', children: [{ _type: 'span', text: 'A rocket.' }] }] },
    ], loading: false })

    render(<FaqAccordion />)
    const btn = screen.getByRole('button', { name: /what is the project about/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('A rocket.')).toBeInTheDocument()
  })

  it('shows a fallback when there are no FAQs', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<FaqAccordion />)
    expect(screen.getByText(/no questions yet/i)).toBeInTheDocument()
  })
})
