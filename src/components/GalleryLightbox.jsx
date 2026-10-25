import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { fullImageUrl } from '../lib/sanity'
import { captionFor } from '../lib/gallery'
import './GalleryLightbox.css'

function SourceAction({ source, onOpenNewsletter }) {
  if (source.type === 'newsletter') {
    return (
      <button className="gallery-lightbox__action" onClick={() => onOpenNewsletter(source.newsletter)}>
        Read the full newsletter →
      </button>
    )
  }
  if (source.type === 'phase' || source.type === 'project') {
    return <Link className="gallery-lightbox__action" to="/project">See it on the Project page →</Link>
  }
  return null
}

export default function GalleryLightbox({ entries, index, onClose, onNavigate, onOpenNewsletter }) {
  const closeRef = useRef(null)
  const entry = entries[index]
  const hasMany = entries.length > 1
  const prev = () => onNavigate((index - 1 + entries.length) % entries.length)
  const next = () => onNavigate((index + 1) % entries.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (hasMany && e.key === 'ArrowLeft') prev()
      if (hasMany && e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const { width, height } = entry.asset.metadata?.dimensions || {}

  return createPortal(
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={captionFor(entry) || 'Image'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button ref={closeRef} className="gallery-lightbox__close" onClick={onClose} aria-label="Close">✕</button>

      <div className="gallery-lightbox__stage">
        {hasMany && (
          <button className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={prev} aria-label="Previous image">‹</button>
        )}
        <img
          className="gallery-lightbox__img"
          src={fullImageUrl(entry.asset, 2400)}
          width={width}
          height={height}
          alt={captionFor(entry) || ''}
        />
        {hasMany && (
          <button className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={next} aria-label="Next image">›</button>
        )}
      </div>

      <div className="gallery-lightbox__info">
        {entry.sources.map((s) => (
          <div key={s.key} className="gallery-lightbox__source">
            <p className="gallery-lightbox__label">{s.label}</p>
            {s.title && <h2 className="gallery-lightbox__title">{s.title}</h2>}
            {s.text && <p className="gallery-lightbox__text">{s.text}</p>}
            <SourceAction source={s} onOpenNewsletter={onOpenNewsletter} />
          </div>
        ))}
        <div className="gallery-lightbox__footer">
          {hasMany && <span>{index + 1} / {entries.length}</span>}
          <a href={entry.asset.url} target="_blank" rel="noopener noreferrer">View original ↗</a>
        </div>
      </div>
    </div>,
    document.body
  )
}
