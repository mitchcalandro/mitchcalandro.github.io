import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PhotoFrame from '../components/PhotoFrame'

const show = (image) => render(<PhotoFrame image={image} src="/p.jpg" alt="Fallback" />).container.querySelector('figcaption')

describe('PhotoFrame', () => {
  it('shows the caption until it is hidden in the Studio, keeping it as the alt text', () => {
    expect(show({ caption: 'Assembly day' })).toHaveTextContent('Assembly day')
    expect(show({ caption: 'Assembly day', hideCaption: false })).toHaveTextContent('Assembly day')
    expect(show({ caption: 'Assembly day', hideCaption: true })).toBeNull()
    expect(screen.getAllByAltText('Assembly day')).toHaveLength(3)
  })

  it('shows just the photo when there is no caption or no image yet', () => {
    expect(show({})).toBeNull()
    expect(show(undefined)).toBeNull()
    expect(screen.getAllByAltText('Fallback')).toHaveLength(2)
  })
})
