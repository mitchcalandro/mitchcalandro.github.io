import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from '../components/Navbar'

const renderNav = (path = '/') =>
  render(<MemoryRouter initialEntries={[path]}><Navbar /></MemoryRouter>)

describe('Navbar', () => {
  it('renders the logo text', () => {
    renderNav()
    expect(screen.getByText('PROJECT AURELIAN')).toBeInTheDocument()
  })

  it('renders all nav links with correct hrefs', () => {
    renderNav()
    const expected = [
      ['Home', '/'],
      ['Project Aurelian', '/project'],
      ['Newsletter', '/newsletter'],
      ['Members', '/members'],
      ['Support Us', '/support'],
      ['Gallery', '/gallery'],
      ['Contact', '/contact'],
    ]
    expected.forEach(([label, href]) => {
      const link = screen.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    })
  })

  it('marks the active route link', () => {
    renderNav('/members')
    expect(screen.getByRole('link', { name: 'Members' })).toHaveClass('navbar__link--active')
  })
})
