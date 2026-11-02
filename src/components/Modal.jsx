import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

// Dialog shell: closes on Escape, the ✕ button or a backdrop click, and locks page scroll while open
export default function Modal({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="modal__backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        {children}
      </div>
    </div>,
    document.body
  )
}
