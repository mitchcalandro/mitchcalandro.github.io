import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RocketSection from '../components/RocketSection'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch')
vi.mock('../lib/sanity', () => ({ queries: { rocketSpecs: '' } }))

const MOCK_SPECS = [
  { _id: '1', title: 'Propulsion', body: [{ _type: 'block', children: [{ text: 'Liquid engine details.' }] }] },
  { _id: '2', title: 'Dimensions', body: [] },
]

describe('RocketSection', () => {
  it('renders section with id="rocket"', () => {
    useSanityFetch.mockReturnValue({ data: [], loading: false })
    render(<RocketSection />)
    expect(document.getElementById('rocket')).toBeInTheDocument()
  })

  it('renders accordion items for each spec', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_SPECS, loading: false })
    render(<RocketSection />)
    expect(screen.getByText('Propulsion')).toBeInTheDocument()
    expect(screen.getByText('Dimensions')).toBeInTheDocument()
  })

  it('expands an accordion item on click', () => {
    useSanityFetch.mockReturnValue({ data: MOCK_SPECS, loading: false })
    render(<RocketSection />)
    fireEvent.click(screen.getByText('Propulsion'))
    expect(screen.getByText('Propulsion').closest('button')).toHaveAttribute('aria-expanded', 'true')
  })
})
