import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './SupportPopup.css'

const STORAGE_KEY = 'aurelian-support-prompt-seen'
const DELAY_MS = 1500

function hasSeen() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY))
  } catch {
    return false
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage blocked (private window, site data disabled) — the prompt will
    // simply show again next visit rather than breaking the page.
  }
}

export default function SupportPopup({ url, suppressed = false }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (suppressed || hasSeen()) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [suppressed])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  })

  function close() {
    remember()
    setOpen(false)
  }

  if (!open) return null

  return createPortal(
    <div
      className="support-popup__backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-popup-title"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="support-popup__panel">
        <button className="support-popup__close" onClick={close} aria-label="Close">✕</button>

        <h2 className="support-popup__title" id="support-popup-title">Support Us!</h2>
        <p className="support-popup__body">
          Project Aurelian is a student-built liquid rocket. Every donation goes straight into
          parts, propellant, and test hardware that get us closer to launch.
        </p>

        <a
          className="btn-primary support-popup__cta"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          Donate on GoFundMe →
        </a>

        <button className="support-popup__dismiss" onClick={close}>Maybe later</button>
      </div>
    </div>,
    document.body
  )
}
