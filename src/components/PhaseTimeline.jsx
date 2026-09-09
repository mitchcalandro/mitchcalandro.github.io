import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './PhaseTimeline.css'

export default function PhaseTimeline() {
  const { data: phases } = useSanityFetch(queries.phases)
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const currentId = settings?.currentPhase?._id

  if (!phases || phases.length === 0) {
    return <p className="phase-timeline__empty">Project phases coming soon.</p>
  }

  return (
    <ol className="phase-timeline">
      {phases.map((phase, i) => {
        const isCurrent = phase._id === currentId
        return (
          <li
            key={phase._id}
            className={`phase-timeline__node ${isCurrent ? 'phase-timeline__node--current' : ''}`}
          >
            <span className="phase-timeline__dot" aria-hidden="true" />
            <span className="phase-timeline__label">{phase.name}</span>
            {i < phases.length - 1 && <span className="phase-timeline__connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
