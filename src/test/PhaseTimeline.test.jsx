import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import './mocks/sanity'
import { useSanityFetch } from '../hooks/useSanityFetch'
import PhaseTimeline from '../components/PhaseTimeline'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))

describe('PhaseTimeline', () => {
  it('renders phases in order and marks the current one', () => {
    useSanityFetch
      .mockReturnValueOnce({ data: [
        { _id: 'p1', name: 'Phase 1 – Manufacturing', order: 1 },
        { _id: 'p2', name: 'Phase 2 – Testing', order: 2 },
      ], loading: false })
      .mockReturnValueOnce({ data: { currentPhase: { _id: 'p2' } }, loading: false })

    render(<PhaseTimeline />)
    expect(screen.getByText('Phase 1 – Manufacturing')).toBeInTheDocument()
    expect(screen.getByText('Phase 2 – Testing')).toBeInTheDocument()
    expect(screen.getByText('Phase 2 – Testing').closest('.phase-timeline__node'))
      .toHaveClass('phase-timeline__node--current')
  })

  it('renders nothing but a placeholder when no phases', () => {
    useSanityFetch
      .mockReturnValueOnce({ data: [], loading: false })
      .mockReturnValueOnce({ data: null, loading: false })
    render(<PhaseTimeline />)
    expect(screen.getByText(/phases coming soon/i)).toBeInTheDocument()
  })
})
