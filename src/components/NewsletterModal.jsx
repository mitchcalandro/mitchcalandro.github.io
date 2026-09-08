import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import './NewsletterModal.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const ptComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        className="newsletter-modal__image"
      />
    ),
  },
}

export default function NewsletterModal({ entry, onClose }) {
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
      className="newsletter-modal__backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="newsletter-modal__panel">
        <button className="newsletter-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <p className="newsletter-modal__date">
          {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
        </p>
        <h2 className="newsletter-modal__title">{entry.title}</h2>
        <div className="newsletter-modal__body">
          {entry.body?.length > 0
            ? <PortableText value={entry.body} components={ptComponents} />
            : <p>Full content coming soon.</p>
          }
        </div>
      </div>
    </div>,
    document.body
  )
}
