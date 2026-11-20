import { PortableText } from '../lib/portableText'
import Modal from './Modal'
import { fullImageUrl } from '../lib/sanity'
import './NewsletterModal.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const ptComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={fullImageUrl(value, 1600)}
        alt={value.alt || ''}
        className="newsletter-modal__image"
      />
    ),
  },
}

export default function NewsletterModal({ entry, onClose }) {
  return (
    <Modal onClose={onClose}>
      <p className="newsletter-modal__date">
        {MONTHS[(entry.month ?? 1) - 1]} {entry.year}
      </p>
      <h2 className="newsletter-modal__title">{entry.title}</h2>
      <div className="newsletter-modal__body rich-text">
        {entry.body?.length > 0
          ? <PortableText value={entry.body} components={ptComponents} />
          : <p>Full content coming soon.</p>
        }
      </div>
    </Modal>
  )
}
