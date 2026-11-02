import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import './mocks/sanity'
import PhaseCard from '../components/PhaseCard'

const phase = {
  _id: 'p1', name: 'Phase 1', shortDescription: 'Build it',
  body: [{ _type: 'block', _key: 'b', children: [{ _type: 'span', text: 'Details here.' }] }],
  images: [{ _key: 'i', asset: { _ref: 'image-a' }, alt: 'Machined part' }],
}

describe('PhaseCard', () => {
  it('shows name and short description, and opens the details in a pop-up box', () => {
    render(<PhaseCard phase={phase} />)
    expect(screen.getByText('Phase 1')).toBeInTheDocument()
    expect(screen.getByText('Build it')).toBeInTheDocument()
    expect(screen.queryByText('Details here.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /phase 1/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Details here.')
    expect(screen.getByAltText('Machined part')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
