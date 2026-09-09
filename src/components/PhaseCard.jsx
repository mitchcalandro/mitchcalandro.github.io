import { PortableText } from '@portabletext/react'
import './PhaseCard.css'

export default function PhaseCard({ phase, isOpen, onToggle }) {
  return (
    <div className={`phase-card ${isOpen ? 'phase-card--open' : ''}`}>
      <button className="phase-card__header" aria-expanded={isOpen} onClick={() => onToggle(phase._id)}>
        <span className="phase-card__name">{phase.name}</span>
        {phase.shortDescription && <span className="phase-card__desc">{phase.shortDescription}</span>}
      </button>
      {isOpen && (
        <div className="phase-card__body">
          {phase.body?.length > 0 ? <PortableText value={phase.body} /> : <p>Details coming soon.</p>}
        </div>
      )}
    </div>
  )
}
