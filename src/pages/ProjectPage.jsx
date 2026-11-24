import { PortableText } from '../lib/portableText'
import PhaseCard from '../components/PhaseCard'
import PhaseTimeline from '../components/PhaseTimeline'
import MembersPreview from '../components/MembersPreview'
import WithPhoto from '../components/WithPhoto'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, fullImageUrl } from '../lib/sanity'
import './ProjectPage.css'

// Position and size are picked per image in the Studio; full-width images get a larger file
const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const position = value.position || 'full'
      const size = position === 'full' ? 'full' : value.size || 'medium'
      return (
        <figure className={`project__figure project__figure--${position} project__figure--${size}`}>
          <img src={fullImageUrl(value, size === 'full' ? 2000 : 1200)} alt={value.alt || value.caption || ''} />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    // Text side by side; each column is its own rich text, so it can hold images too
    columns: ({ value }) => (
      <div className="project__columns" style={{ '--cols': value.columns?.length || 1 }}>
        {value.columns?.map((col) => (
          <div key={col._key} className="rich-text">
            <PortableText value={col.body || []} components={ptComponents} />
          </div>
        ))}
      </div>
    ),
  },
}

export default function ProjectPage() {
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const { data: phases } = useSanityFetch(queries.phases)

  return (
    <div className="project page">
      <h1 className="section-title">Project Aurelian</h1>

      <div className="project__body">
        <WithPhoto image={settings?.projectPhoto} alt="Project Aurelian team at work">
          <div className="rich-text">
            {settings?.projectBody?.length > 0
              ? <PortableText value={settings.projectBody} components={ptComponents} />
              : <p className="section-subtitle">Project details coming soon.</p>}
          </div>
        </WithPhoto>
      </div>

      <h2 className="section-title project__subhead">Phases</h2>
      <div className="project__phases">
        {phases?.map((phase) => (
          <PhaseCard key={phase._id} phase={phase} />
        ))}
        {(!phases || phases.length === 0) && <p className="section-subtitle">Phases coming soon.</p>}
      </div>

      <PhaseTimeline />

      <h2 className="section-title project__subhead">The Team</h2>
      <MembersPreview />
    </div>
  )
}
