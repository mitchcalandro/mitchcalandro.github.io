import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DonateBox from '../components/DonateBox'

const URL = 'https://www.gofundme.com/f/project-aurelian'

describe('DonateBox', () => {
  it('renders a main donate link to the campaign', () => {
    render(<DonateBox url={URL} />)
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', URL)
  })

  it('renders a chip per suggested amount, carrying the amount through', () => {
    render(<DonateBox url={URL} tiers={[{ amount: 25, note: 'Igniters' }, { amount: 100, note: 'Valves' }]} />)
    expect(screen.getByRole('link', { name: /\$25/ })).toHaveAttribute('href', `${URL}?amount=25`)
    expect(screen.getByRole('link', { name: /\$100/ })).toHaveAttribute('href', `${URL}?amount=100`)
    expect(screen.getByText('Igniters')).toBeInTheDocument()
  })

  it('appends the amount correctly when the url already has a query string', () => {
    render(<DonateBox url={`${URL}?utm_source=site`} tiers={[{ amount: 50 }]} />)
    expect(screen.getByRole('link', { name: /\$50/ }))
      .toHaveAttribute('href', `${URL}?utm_source=site&amount=50`)
  })

  it('still renders the main CTA when there are no tiers', () => {
    const { container } = render(<DonateBox url={URL} />)
    expect(container.querySelectorAll('.donate-box__tier')).toHaveLength(0)
    expect(screen.getByRole('link', { name: /donate/i })).toBeInTheDocument()
  })

  it('shows a coming-soon message instead of a dead link when no url is set', () => {
    render(<DonateBox url={null} tiers={[{ amount: 25 }]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/donation link coming soon/i)).toBeInTheDocument()
  })
})
