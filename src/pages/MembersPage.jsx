import MemberCard from '../components/MemberCard'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './MembersPage.css'

const TIERS = ['leadership', 'lead', 'member']

// Tier is stored as a number (1 = leadership, 2 = lead, 3 = member) so the Studio can sort
// members by role. Older entries stored the tier name, so both are accepted.
function tierOf(member) {
  if (typeof member.tier === 'number') return TIERS[member.tier - 1] || 'member'
  return TIERS.includes(member.tier) ? member.tier : 'member'
}

export default function MembersPage() {
  const { data: members } = useSanityFetch(queries.members)
  const byTier = Object.fromEntries(TIERS.map((t) => [t, (members || []).filter((m) => tierOf(m) === t)]))

  return (
    // The head-counts let MembersPage.css size each tier's cards to fill its rows
    <div className="members-page page" style={{ '--leads': byTier.lead.length, '--members': byTier.member.length }}>
      <h1 className="section-title">Members</h1>
      {(!members || members.length === 0) && (
        <p className="section-subtitle">Team roster coming soon.</p>
      )}

      {TIERS.map((tier) => {
        const inTier = byTier[tier]
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
