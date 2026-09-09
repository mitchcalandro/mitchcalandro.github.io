import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import PhaseCard from '../components/PhaseCard'
import PhaseTimeline from '../components/PhaseTimeline'
import MembersPreview from '../components/MembersPreview'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './ProjectPage.css'

export default function ProjectPage() {
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const { data: phases } = useSanityFetch(queries.phases)
  const [openId, setOpenId] = useState(null)

  return (
    <div className="project page">
      <h1 className="section-title">Project Aurelian</h1>

      <div className="project__body">
        {settings?.projectBody?.length > 0
          ? <PortableText value={settings.projectBody} />
          : <p className="section-subtitle">Project details coming soon.</p>}
      </div>

      <h2 className="section-title project__subhead">Phases</h2>
      <div className="project__phases">
        {phases?.map((phase) => (
          <PhaseCard
            key={phase._id}
            phase={phase}
            isOpen={openId === phase._id}
            onToggle={(id) => setOpenId(openId === id ? null : id)}
          />
        ))}
        {(!phases || phases.length === 0) && <p className="section-subtitle">Phases coming soon.</p>}
      </div>

      <PhaseTimeline />

      <h2 className="section-title project__subhead">The Team</h2>
      <MembersPreview />
    </div>
  )
}
