import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn(() => ({ data: null })) }))
vi.mock('../lib/sanity', () => ({ queries: { siteSettings: 's' }, logoUrl: () => '/logo.png' }))
import Navbar from '../components/Navbar'

const renderNav = (path = '/') =>
  render(<MemoryRouter initialEntries={[path]}><Navbar /></MemoryRouter>)

describe('Navbar', () => {
  it('renders the logo text', () => {
    renderNav()
    expect(screen.getByText('PROJECT AURELIAN')).toBeInTheDocument()
  })

  it('shows the Sanity logo beside the name only when one is uploaded', () => {
    const { container, unmount } = renderNav()
    expect(container.querySelector('.navbar__mark')).not.toBeInTheDocument()
    unmount()
    useSanityFetch.mockReturnValue({ data: { logo: { asset: { _ref: 'image-l' } } } })
    expect(renderNav().container.querySelector('.navbar__mark')).toHaveAttribute('src', '/logo.png')
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
