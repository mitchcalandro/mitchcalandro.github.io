import { useState } from 'react'
import { PortableText } from '../lib/portableText'
import Modal from './Modal'
import RichText from './RichText'
import { fullImageUrl } from '../lib/sanity'
import './PhaseCard.css'

const ptComponents = {
  types: {
    image: ({ value }) => value?.asset
      ? <img src={fullImageUrl(value, 1400)} alt={value.alt || ''} className="phase-modal__image" />
      : null,
  },
}

export default function PhaseCard({ phase }) {
  const [open, setOpen] = useState(false)
  const images = (phase.images || []).filter((img) => img?.asset)

  return (
    <>
      <button className="phase-card" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span className="phase-card__name">{phase.name}</span>
        {phase.shortDescription && <span className="phase-card__desc"><RichText inline value={phase.shortDescription} /></span>}
        <span className="phase-card__more">Details →</span>
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="phase-modal__title">{phase.name}</h2>
          {phase.shortDescription && <p className="phase-modal__desc"><RichText inline value={phase.shortDescription} /></p>}
          <div className="phase-modal__body rich-text">
            {phase.body?.length > 0
              ? <PortableText value={phase.body} components={ptComponents} />
              : <p>Details coming soon.</p>}
          </div>
          {images.length > 0 && (
            <div className="phase-modal__gallery">
              {images.map((img) => (
                <img key={img._key || img.asset._ref} src={fullImageUrl(img, 900)} alt={img.alt || phase.name} />
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
