import MemberCard from '../components/MemberCard'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './MembersPage.css'

const TIERS = ['leadership', 'lead', 'member']

export default function MembersPage() {
  const { data: members } = useSanityFetch(queries.members)

  return (
    <div className="members-page page">
      <h1 className="section-title">Members</h1>
      {(!members || members.length === 0) && (
        <p className="section-subtitle">Team roster coming soon.</p>
      )}

      {TIERS.map((tier) => {
        const inTier = (members || []).filter((m) => (m.tier || 'member') === tier)
        if (inTier.length === 0) return null
        return (
          <div key={tier} className={`members-page__tier members-page__tier--${tier}`}>
            {inTier.map((m) => <MemberCard key={m._id} member={m} tier={tier} />)}
          </div>
        )
      })}
    </div>
  )
}
