import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimelineSection from '../components/TimelineSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({ queries: { timeline: '' } }))

const MOCK_MILESTONES = [
  {
    _id: '1', month: 9, year: 2026,
    goals: [{ text: 'Complete CAD model', completed: true }, { text: 'Order materials', completed: false }],
  },
]

describe('TimelineSection', () => {
  it('renders section with id="timeline"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<TimelineSection />)
    expect(document.getElementById('timeline')).toBeInTheDocument()
  })

  it('renders month label and goals', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MILESTONES, loading: false })
    render(<TimelineSection />)
    expect(screen.getByText(/September 2026/)).toBeInTheDocument()
    expect(screen.getByText('Complete CAD model')).toBeInTheDocument()
    expect(screen.getByText('Order materials')).toBeInTheDocument()
  })

  it('marks completed goals visually', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_MILESTONES, loading: false })
    render(<TimelineSection />)
    const completedItem = screen.getByText('Complete CAD model').closest('li')
    expect(completedItem).toHaveClass('timeline__goal--done')
  })
})
