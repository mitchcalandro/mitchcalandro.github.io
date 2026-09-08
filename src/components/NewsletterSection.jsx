import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import NewsletterModal from './NewsletterModal'
import './NewsletterSection.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function NewsletterSection() {
  const { data: entries, loading } = useSanityFetch(queries.newsletter)
  const [selected, setSelected] = useState(null)

  return (
    <section id="newsletter">
      <div className="section-container">
        <h2 className="section-title">Newsletter</h2>
        <p className="section-subtitle">Monthly updates from the team.</p>

        {loading && <p className="newsletter__loading">Loading entries…</p>}

        {!loading && entries?.length === 0 && (
          <p className="newsletter__empty">First newsletter coming soon. Stay tuned.</p>
        )}

        <div className="newsletter__grid">
          {entries?.map(entry => (
            <article key={entry._id} className="newsletter__card">
              <p className="newsletter__card-date">
                {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
              </p>
              <h3 className="newsletter__card-title">{entry.title}</h3>
              <p className="newsletter__card-preview">{entry.preview}</p>
              <button
                className="btn-primary newsletter__read-more"
                onClick={() => setSelected(entry)}
              >
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <NewsletterModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
