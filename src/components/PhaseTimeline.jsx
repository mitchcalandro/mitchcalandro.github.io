import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './PhaseTimeline.css'

// The phase number sits in the dot, so a leading "Phase 3 - " is dropped from the label
const shortName = (name) => name.replace(/^Phase\s*\d+\s*[-–—:]\s*/i, '') || name

export default function PhaseTimeline() {
  const { data: phases } = useSanityFetch(queries.phases)
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const currentId = settings?.currentPhase?._id

  if (!phases || phases.length === 0) {
    return <p className="phase-timeline__empty">Project phases coming soon.</p>
  }

  const currentIndex = phases.findIndex((p) => p._id === currentId)

  return (
    <ol className="phase-timeline">
      {phases.map((phase, i) => {
        const state = i === currentIndex ? 'current' : i < currentIndex ? 'done' : 'upcoming'
        return (
          <li key={phase._id} className={`phase-timeline__node phase-timeline__node--${state}`}>
            <span className="phase-timeline__dot">{i + 1}</span>
            <span className="phase-timeline__label">
              {shortName(phase.name)}
              {state === 'current' && <span className="phase-timeline__now">Now</span>}
            </span>
            {i < phases.length - 1 && <span className="phase-timeline__connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
