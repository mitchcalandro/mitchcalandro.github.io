import './NewsletterCard.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function NewsletterCard({ entry, onReadMore, featured = false }) {
  return (
    <article className={`newsletter-card ${featured ? 'newsletter-card--featured' : ''}`}>
      <p className="newsletter-card__date">
        {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
      </p>
      <h3 className="newsletter-card__title">{entry.title}</h3>
      <p className="newsletter-card__preview">{entry.preview}</p>
      <button className="btn-primary newsletter-card__read-more" onClick={() => onReadMore(entry)}>
        Read More →
      </button>
    </article>
  )
}
