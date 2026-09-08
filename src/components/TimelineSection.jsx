import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './TimelineSection.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function TimelineSection() {
  const { data: milestones, loading } = useSanityFetch(queries.timeline)

  return (
    <section id="timeline">
      <div className="section-container">
        <h2 className="section-title">Project Timeline</h2>
        <p className="section-subtitle">Monthly milestones tracking our progress.</p>

        {loading && <p className="timeline__loading">Loading timeline…</p>}

        <div className="timeline">
          {milestones?.map((milestone, index) => (
            <div key={milestone._id} className="timeline__entry">
              <div className="timeline__connector">
                <div className="timeline__dot" />
                {index < milestones.length - 1 && <div className="timeline__line" />}
              </div>
              <div className="timeline__card">
                <p className="timeline__month">
                  {MONTHS[(milestone.month ?? 1) - 1]} {milestone.year}
                </p>
                <ul className="timeline__goals">
                  {milestone.goals?.map((goal, i) => (
                    <li
                      key={i}
                      className={`timeline__goal ${goal.completed ? 'timeline__goal--done' : ''}`}
                    >
                      <span className="timeline__goal-icon" aria-hidden="true">
                        {goal.completed ? '✓' : '○'}
                      </span>
                      {goal.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
