import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { gallery: 'g', phases: 'p' }, urlFor: () => ({ width: () => ({ url: () => '/img.jpg' }) }) }))

import GalleryPage from '../pages/GalleryPage'

describe('GalleryPage', () => {
  it('filters images by phase', () => {
    useSanityFetch.mockImplementation((q) => q === 'g'
      ? { data: [
          { _id: 'g1', image: {}, caption: 'Engine', phase: { _id: 'p1', name: 'Phase 1' } },
          { _id: 'g2', image: {}, caption: 'Test fire', phase: { _id: 'p2', name: 'Phase 2' } },
        ], loading: false }
      : { data: [
          { _id: 'p1', name: 'Phase 1' },
          { _id: 'p2', name: 'Phase 2' },
        ], loading: false })

    render(<GalleryPage />)
    expect(screen.getByText('Engine')).toBeInTheDocument()
    expect(screen.getByText('Test fire')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Phase 1' }))
    expect(screen.getByText('Engine')).toBeInTheDocument()
    expect(screen.queryByText('Test fire')).not.toBeInTheDocument()
  })

  it('shows empty state', () => {
    useSanityFetch.mockImplementation(() => ({ data: [], loading: false }))
    render(<GalleryPage />)
    expect(screen.getByText(/no images yet/i)).toBeInTheDocument()
  })
})
