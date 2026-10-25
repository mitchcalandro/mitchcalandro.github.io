import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'

vi.mock('../hooks/useSanityFetch', () => ({ useSanityFetch: vi.fn() }))
vi.mock('../lib/sanity', () => ({ queries: { gallery: 'g', phases: 'p' }, fullImageUrl: () => '/img.jpg' }))

import GalleryPage from '../pages/GalleryPage'

const asset = (id) => ({ _id: id, url: `https://cdn/${id}.jpg`, metadata: { dimensions: { width: 400, height: 600 } } })

const gallery = {
  memberPhotos: ['headshot'],
  items: [
    { _id: 'g1', caption: 'Engine', description: 'First hot fire', phase: { _id: 'p1', name: 'Phase 1' }, asset: asset('engine') },
    { _id: 'g2', caption: 'Scott headshot', asset: asset('headshot') },
  ],
  phases: [{ _id: 'p2', name: 'Phase 2', shortDescription: 'Testing', images: [{ asset: asset('stand') }] }],
  newsletters: [{ _id: 'n1', title: 'September update', month: 9, year: 2026, preview: 'Big month', body: [], images: [{ asset: asset('chart') }] }],
  project: null,
}

function renderGallery(data = gallery) {
  useSanityFetch.mockImplementation((q) => q === 'g'
    ? { data, loading: false }
    : { data: [{ _id: 'p1', name: 'Phase 1' }, { _id: 'p2', name: 'Phase 2' }], loading: false })
  return render(<MemoryRouter><GalleryPage /></MemoryRouter>)
}

describe('GalleryPage', () => {
  it('shows images from gallery items, phases and newsletters but never member photos', () => {
    renderGallery()
    expect(screen.getByAltText('Engine')).toBeInTheDocument()
    expect(screen.getByAltText('Phase 2')).toBeInTheDocument()
    expect(screen.getByAltText('September update')).toBeInTheDocument()
    expect(screen.queryByAltText('Scott headshot')).not.toBeInTheDocument()
  })

  it('filters images by phase', () => {
    renderGallery()
    fireEvent.click(screen.getByRole('button', { name: 'Phase 1' }))
    expect(screen.getByAltText('Engine')).toBeInTheDocument()
    expect(screen.queryByAltText('Phase 2')).not.toBeInTheDocument()
    expect(screen.queryByAltText('September update')).not.toBeInTheDocument()
  })

  it('opens the full image with the details from where it was posted', () => {
    renderGallery()
    fireEvent.click(screen.getByRole('button', { name: 'Open Engine' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Gallery · Phase 1')).toBeInTheDocument()
    expect(within(dialog).getByText('First hot fire')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /view original/i })).toHaveAttribute('href', 'https://cdn/engine.jpg')
  })

  it('links phase images to the Project page', () => {
    renderGallery()
    fireEvent.click(screen.getByRole('button', { name: 'Open Phase 2' }))
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: /project page/i })).toHaveAttribute('href', '/project')
  })

  it('opens the full newsletter from a newsletter image', () => {
    renderGallery()
    fireEvent.click(screen.getByRole('button', { name: 'Open September update' }))
    expect(screen.getByText('Newsletter · September 2026')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /read the full newsletter/i }))
    expect(screen.queryByText('Newsletter · September 2026')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'September update' })).toBeInTheDocument()
  })

  it('steps through images with the arrow keys and closes with Escape', () => {
    renderGallery()
    fireEvent.click(screen.getByRole('button', { name: 'Open Engine' }))
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows empty state', () => {
    renderGallery({ memberPhotos: [], items: [], phases: [], newsletters: [], project: null })
    expect(screen.getByText(/no images yet/i)).toBeInTheDocument()
  })
})
