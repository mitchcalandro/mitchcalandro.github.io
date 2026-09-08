import { useState } from 'react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import RocketAccordion from './RocketAccordion'
import './RocketSection.css'

export default function RocketSection() {
  const { data: specs, loading } = useSanityFetch(queries.rocketSpecs)
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <section id="rocket">
      <div className="section-container">
        <h2 className="section-title">The Rocket</h2>
        <p className="section-subtitle">Technical specifications for Project Aurelian.</p>

        {loading && <p className="rocket__loading">Loading specs…</p>}

        <div className="rocket__accordion-list">
          {specs?.map(spec => (
            <RocketAccordion
              key={spec._id}
              spec={spec}
              isOpen={openId === spec._id}
              onToggle={() => toggle(spec._id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
