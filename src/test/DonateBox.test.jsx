import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DonateBox from '../components/DonateBox'

const URL = 'https://www.gofundme.com/f/project-aurelian'

describe('DonateBox', () => {
  it('renders a donate link pointing at the campaign', () => {
    render(<DonateBox url={URL} />)
    const link = screen.getByRole('link', { name: /donate/i })
    expect(link).toHaveAttribute('href', URL)
  })

  it('opens the campaign in a new tab safely', () => {
    render(<DonateBox url={URL} />)
    const link = screen.getByRole('link', { name: /donate/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
