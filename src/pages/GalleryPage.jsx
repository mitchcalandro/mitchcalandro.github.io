import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, urlFor } from '../lib/sanity'
import './GalleryPage.css'

export default function GalleryPage() {
  const { data: items } = useSanityFetch(queries.gallery)
  const { data: phases } = useSanityFetch(queries.phases)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? items || []
    : (items || []).filter((it) => it.phase?._id === filter)

  return (
    <div className="gallery-page page">
      <h1 className="section-title">Gallery</h1>

      <div className="gallery-page__filters">
        <button
          className={`gallery-page__filter ${filter === 'all' ? 'gallery-page__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {phases?.map((p) => (
          <button
            key={p._id}
            className={`gallery-page__filter ${filter === p._id ? 'gallery-page__filter--active' : ''}`}
            onClick={() => setFilter(p._id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="section-subtitle">No images yet — check back soon.</p>}

      <div className="gallery-page__grid">
        {filtered.map((it) => (
          <figure key={it._id} className="gallery-page__item">
            <img className="gallery-page__img" src={urlFor(it.image).width(600).url()} alt={it.caption || ''} />
            {it.caption && <figcaption className="gallery-page__caption">{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  )
}
