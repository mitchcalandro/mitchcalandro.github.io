import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PhaseCard from '../components/PhaseCard'

const phase = { _id: 'p1', name: 'Phase 1', shortDescription: 'Build it', body: [{ _type: 'block', _key: 'b', children: [{ _type: 'span', text: 'Details here.' }] }] }

describe('PhaseCard', () => {
  it('shows name and short description, toggles body', () => {
    const onToggle = vi.fn()
    const { rerender } = render(<PhaseCard phase={phase} isOpen={false} onToggle={onToggle} />)
    expect(screen.getByText('Phase 1')).toBeInTheDocument()
    expect(screen.getByText('Build it')).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /phase 1/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(onToggle).toHaveBeenCalledWith('p1')
    rerender(<PhaseCard phase={phase} isOpen={true} onToggle={onToggle} />)
    expect(screen.getByText('Details here.')).toBeInTheDocument()
  })
})
