import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SupportPopup from '../components/SupportPopup'

const URL = 'https://www.gofundme.com'
const KEY = 'aurelian-support-prompt-seen'

const renderAndWait = (props = {}) => {
  const result = render(<SupportPopup url={URL} {...props} />)
  act(() => { vi.runAllTimers() })
  return result
}

describe('SupportPopup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
    document.body.style.overflow = ''
  })

  it('does not appear immediately on load', () => {
    render(<SupportPopup url={URL} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('appears on a first visit and offers the donate link', () => {
    renderAndWait()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', URL)
  })

  it('stays hidden when the visitor has already seen it', () => {
    localStorage.setItem(KEY, '1')
    renderAndWait()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('remembers the dismissal so it never nags again', () => {
    renderAndWait()
    fireEvent.click(screen.getByRole('button', { name: /maybe later/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(localStorage.getItem(KEY)).toBeTruthy()
  })

  it('closes on Escape', () => {
    renderAndWait()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when the backdrop is clicked', () => {
    renderAndWait()
    fireEvent.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks itself seen when the visitor follows the donate link', () => {
    renderAndWait()
    fireEvent.click(screen.getByRole('link', { name: /donate/i }))
    expect(localStorage.getItem(KEY)).toBeTruthy()
  })

  it('never shows on the support page itself', () => {
    renderAndWait({ suppressed: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('survives localStorage being unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    expect(() => renderAndWait()).not.toThrow()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    spy.mockRestore()
  })
})
