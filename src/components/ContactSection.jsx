import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './ContactSection.css'

export default function ContactSection() {
  const { data: contacts } = useSanityFetch(queries.contact)

  return (
    <section id="contact">
      <div className="section-container">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Get in touch with the team.</p>
        <div className="contact__grid">
          {contacts?.map(contact => (
            <div key={contact._id} className="contact__card">
              <h3 className="contact__name">{contact.name}</h3>
              {contact.role && <p className="contact__role">{contact.role}</p>}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="contact__link">
                  {contact.email}
                </a>
              )}
              {contact.linkedInUrl && (
                <a
                  href={contact.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
