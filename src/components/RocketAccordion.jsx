import { PortableText } from '@portabletext/react'
import './RocketAccordion.css'

export default function RocketAccordion({ spec, isOpen, onToggle }) {
  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''}`}>
      <button
        className="accordion__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{spec.title}</span>
        <span className="accordion__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="accordion__body">
        {isOpen && (
          <div className="accordion__content">
            {spec.body?.length > 0
              ? <PortableText value={spec.body} />
              : <p>Content coming soon.</p>
            }
          </div>
        )}
      </div>
    </div>
  )
}
