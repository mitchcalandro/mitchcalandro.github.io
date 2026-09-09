import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NewsletterCard from '../components/NewsletterCard'

const entry = { _id: 'n1', title: 'March Update', month: 3, year: 2026, preview: 'Big month.' }

describe('NewsletterCard', () => {
  it('renders title, date, preview and fires onReadMore', () => {
    const onReadMore = vi.fn()
    render(<NewsletterCard entry={entry} onReadMore={onReadMore} />)
    expect(screen.getByText('March Update')).toBeInTheDocument()
    expect(screen.getByText(/March 2026/)).toBeInTheDocument()
    expect(screen.getByText('Big month.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /read more/i }))
    expect(onReadMore).toHaveBeenCalledWith(entry)
  })

  it('applies featured class when featured', () => {
    const { container } = render(<NewsletterCard entry={entry} onReadMore={() => {}} featured />)
    expect(container.querySelector('.newsletter-card--featured')).toBeInTheDocument()
  })
})
