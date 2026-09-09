import ContactForm from '../components/ContactForm'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './ContactPage.css'

export default function ContactPage() {
  const { data: contacts } = useSanityFetch(queries.contact)

  return (
    <div className="contact-page page">
      <h1 className="section-title">Contact</h1>
      <p className="section-subtitle contact-page__intro">
        For inquiries or concerns, the fastest path is email. Response within 48 hours during regular business hours.
      </p>

      {(!contacts || contacts.length === 0) && (
        <p className="section-subtitle">Contact details coming soon.</p>
      )}

      <div className="contact-page__grid">
        {contacts?.map((c) => (
          <article key={c._id} className="contact-card">
            <h3 className="contact-card__name">{c.name}</h3>
            <p className="contact-card__role">{c.role}</p>
            {c.email && (
              <a className="contact-card__email" href={`mailto:${c.email}`}>{c.email}</a>
            )}
            {c.linkedInUrl && (
              <a className="contact-card__link" href={c.linkedInUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            <ContactForm formspreeId={c.formspreeId} />
          </article>
        ))}
      </div>
    </div>
  )
}
