import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  it('renders the logo text', () => {
    render(<Navbar />)
    expect(screen.getByText('PROJECT AURELIAN')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    const labels = ['Home', 'Newsletter', 'About', 'Rocket', 'Timeline', 'Members', 'Support Us', 'Contact']
    labels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
  })

  it('calls scrollIntoView on nav link click', () => {
    const mockScroll = vi.fn()
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScroll })
    render(<Navbar />)
    fireEvent.click(screen.getByText('About'))
    expect(mockScroll).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
