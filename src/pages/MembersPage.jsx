import MemberCard from '../components/MemberCard'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './MembersPage.css'

export default function MembersPage() {
  const { data: members } = useSanityFetch(queries.members)

  return (
    <div className="members-page page">
      <h1 className="section-title">Members</h1>
      {(!members || members.length === 0) && (
        <p className="section-subtitle">Team roster coming soon.</p>
      )}
      <div className="members-page__grid">
        {members?.map((m) => <MemberCard key={m._id} member={m} />)}
      </div>
    </div>
  )
}
