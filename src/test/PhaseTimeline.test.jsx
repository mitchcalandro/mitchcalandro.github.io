import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import './mocks/sanity'
import { useSanityFetch } from '../hooks/useSanityFetch'
import PhaseTimeline from '../components/PhaseTimeline'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))

describe('PhaseTimeline', () => {
  it('numbers the phases and marks finished, current and upcoming ones', () => {
    useSanityFetch
      .mockReturnValueOnce({ data: [
        { _id: 'p1', name: 'Phase 1 – Manufacturing', order: 1 },
        { _id: 'p2', name: 'Phase 2 - Testing', order: 2 },
        { _id: 'p3', name: 'Launch', order: 3 },
      ], loading: false })
      .mockReturnValueOnce({ data: { currentPhase: { _id: 'p2' } }, loading: false })

    render(<PhaseTimeline />)
    const node = (text) => screen.getByText(text).closest('.phase-timeline__node')
    // the number is in the dot, so the "Phase N -" prefix is dropped; other names stay whole
    expect(node('Manufacturing')).toHaveClass('phase-timeline__node--done')
    expect(node('Testing')).toHaveClass('phase-timeline__node--current')
    expect(node('Launch')).toHaveClass('phase-timeline__node--upcoming')
    expect(node('Testing')).toHaveTextContent('Now')
    expect(node('Launch').querySelector('.phase-timeline__dot')).toHaveTextContent('3')
  })

  it('renders nothing but a placeholder when no phases', () => {
    useSanityFetch
      .mockReturnValueOnce({ data: [], loading: false })
      .mockReturnValueOnce({ data: null, loading: false })
    render(<PhaseTimeline />)
    expect(screen.getByText(/phases coming soon/i)).toBeInTheDocument()
  })
})
