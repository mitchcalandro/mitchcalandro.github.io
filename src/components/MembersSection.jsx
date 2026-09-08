import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import MemberCard from './MemberCard'
import './MembersSection.css'

export default function MembersSection() {
  const { data: members, loading } = useSanityFetch(queries.members)

  return (
    <section id="members">
      <div className="section-container">
        <h2 className="section-title">The Team</h2>
        <p className="section-subtitle">The people building Project Aurelian.</p>

        {loading && <p className="members__loading">Loading team…</p>}

        <div className="members__grid">
          {members?.map(member => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
