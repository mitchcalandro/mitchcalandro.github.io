import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, fullImageUrl } from '../lib/sanity'
import { buildGallery, isInPhase, captionFor } from '../lib/gallery'
import GalleryLightbox from '../components/GalleryLightbox'
import NewsletterModal from '../components/NewsletterModal'
import './GalleryPage.css'

export default function GalleryPage() {
  const { data } = useSanityFetch(queries.gallery)
  const { data: phases } = useSanityFetch(queries.phases)
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)
  const [newsletter, setNewsletter] = useState(null)

  const entries = buildGallery(data)
  const filtered = filter === 'all' ? entries : entries.filter((e) => isInPhase(e, filter))

  const chooseFilter = (id) => { setFilter(id); setOpenIndex(null) }

  return (
    <div className="gallery-page page">
      <h1 className="section-title">Gallery</h1>

      <div className="gallery-page__filters">
        <button
          className={`gallery-page__filter ${filter === 'all' ? 'gallery-page__filter--active' : ''}`}
          onClick={() => chooseFilter('all')}
        >
          All
        </button>
        {phases?.map((p) => (
          <button
            key={p._id}
            className={`gallery-page__filter ${filter === p._id ? 'gallery-page__filter--active' : ''}`}
            onClick={() => chooseFilter(p._id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="section-subtitle">No images yet — check back soon.</p>}

      <div className="gallery-page__grid">
        {filtered.map((entry, i) => {
          const caption = captionFor(entry)
          const { width, height } = entry.asset.metadata?.dimensions || {}
          return (
            <figure key={entry.asset._id} className="gallery-page__item">
              <button className="gallery-page__open" onClick={() => setOpenIndex(i)} aria-label={`Open ${caption || 'image'}`}>
                <img
                  className="gallery-page__img"
                  src={fullImageUrl(entry.asset, 800)}
                  width={width}
                  height={height}
                  alt={caption || ''}
                  loading="lazy"
                />
              </button>
              {caption && <figcaption className="gallery-page__caption">{caption}</figcaption>}
            </figure>
          )
        })}
      </div>

      {openIndex !== null && filtered[openIndex] && (
        <GalleryLightbox
          entries={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
          onOpenNewsletter={(n) => { setOpenIndex(null); setNewsletter(n) }}
        />
      )}

      {newsletter && <NewsletterModal entry={newsletter} onClose={() => setNewsletter(null)} />}
    </div>
  )
}
