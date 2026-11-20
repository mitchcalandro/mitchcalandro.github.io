import ContactForm from '../components/ContactForm'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './ContactPage.css'

const DEFAULT_FORMSPREE_ID = 'xyeeeykj'
const DEFAULT_INTEREST_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeNYlfGoilZ84iwix8XHPKpOEx4wCDnNUYF4QbcLw5ZEuc-DA/viewform'

export default function ContactPage() {
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const { data: contacts } = useSanityFetch(queries.contact)

  const formspreeId = settings?.formspreeId || DEFAULT_FORMSPREE_ID
  const interestFormUrl = settings?.interestFormUrl || DEFAULT_INTEREST_FORM_URL

  return (
    <div className="contact-page page">
      <h1 className="section-title">Contact</h1>
      <p className="section-subtitle contact-page__intro">
        For inquiries or concerns, send us a message below. Response within 48 hours during regular business hours.
      </p>

      <ContactForm formspreeId={formspreeId} />

      <aside className="contact-page__interest">
        <div>
          <h2 className="contact-page__interest-title">Want to work on the project?</h2>
          <p>Fill out our interest form and we'll be in touch.</p>
        </div>
        <a className="btn-primary" href={interestFormUrl} target="_blank" rel="noopener noreferrer">Interest form ↗</a>
      </aside>

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
          </article>
        ))}
      </div>
    </div>
  )
}
