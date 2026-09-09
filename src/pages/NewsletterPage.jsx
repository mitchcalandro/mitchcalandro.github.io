import { useState } from 'react'
import NewsletterCard from '../components/NewsletterCard'
import NewsletterModal from '../components/NewsletterModal'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './NewsletterPage.css'

export default function NewsletterPage() {
  const { data: entries, loading } = useSanityFetch(queries.newsletter)
  const [selected, setSelected] = useState(null)

  const [featured, ...rest] = entries || []

  return (
    <div className="newsletter-page page">
      <h1 className="section-title">Newsletter</h1>
      <p className="section-subtitle">Monthly updates from the team.</p>

      {loading && <p className="section-subtitle">Loading…</p>}
      {!loading && (!entries || entries.length === 0) && (
        <p className="section-subtitle">First newsletter coming soon. Stay tuned.</p>
      )}

      <div className="newsletter-page__grid">
        {featured && <NewsletterCard entry={featured} onReadMore={setSelected} featured />}
        {rest.map((entry) => (
          <NewsletterCard key={entry._id} entry={entry} onReadMore={setSelected} />
        ))}
      </div>

      {selected && <NewsletterModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
