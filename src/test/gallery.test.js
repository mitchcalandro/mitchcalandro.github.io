import { describe, it, expect } from 'vitest'
import { buildGallery, isInPhase, captionFor } from '../lib/gallery'

const asset = (id) => ({ _id: id, url: `https://cdn/${id}.jpg`, metadata: { dimensions: { width: 400, height: 600 } } })

const data = {
  memberPhotos: ['headshot'],
  items: [
    { _id: 'g1', caption: 'Launch day', description: 'Liftoff', phase: { _id: 'p3', name: 'Phase 3' }, asset: asset('rocket') },
    { _id: 'g2', caption: 'Scott', asset: asset('headshot') },
  ],
  phases: [
    { _id: 'p3', name: 'Phase 3', shortDescription: 'Assembly', images: [{ asset: asset('rocket') }, { asset: asset('bolts') }] },
  ],
  newsletters: [
    { _id: 'n1', title: 'September update', month: 9, year: 2026, preview: 'News', images: [{ asset: asset('chart') }, { asset: asset('headshot') }] },
  ],
  project: { images: [{ asset: asset('diagram') }] },
}

describe('buildGallery', () => {
  it('collects images from gallery items, phases, newsletters and the project write-up', () => {
    const ids = buildGallery(data).map((e) => e.asset._id)
    expect(ids).toEqual(['rocket', 'bolts', 'chart', 'diagram'])
  })

  it('never includes member photos, even when they are posted elsewhere', () => {
    const ids = buildGallery(data).map((e) => e.asset._id)
    expect(ids).not.toContain('headshot')
  })

  it('shows an image posted in several places once, listing every place', () => {
    const rocket = buildGallery(data).find((e) => e.asset._id === 'rocket')
    expect(rocket.sources.map((s) => s.type)).toEqual(['gallery', 'phase'])
  })

  it('labels newsletter images with the issue date and keeps the newsletter for opening', () => {
    const chart = buildGallery(data).find((e) => e.asset._id === 'chart')
    expect(chart.sources[0].label).toBe('Newsletter · September 2026')
    expect(chart.sources[0].newsletter._id).toBe('n1')
  })

  it('returns nothing before the data has loaded', () => {
    expect(buildGallery(null)).toEqual([])
  })
})

describe('isInPhase', () => {
  it('matches phase images and gallery items tagged with the phase', () => {
    const [rocket, bolts, chart] = buildGallery(data)
    expect(isInPhase(rocket, 'p3')).toBe(true)
    expect(isInPhase(bolts, 'p3')).toBe(true)
    expect(isInPhase(chart, 'p3')).toBe(false)
  })
})

describe('captionFor', () => {
  it('prefers a gallery caption, then the title of where it was posted', () => {
    const [rocket, bolts] = buildGallery(data)
    expect(captionFor(rocket)).toBe('Launch day')
    expect(captionFor(bolts)).toBe('Phase 3')
  })
})
