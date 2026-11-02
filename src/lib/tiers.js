export const TIERS = ['leadership', 'lead', 'member']

// Tier is stored as a number (1 = leadership, 2 = lead, 3 = member) so the Studio can sort
// members by role. Older entries stored the tier name, so both are accepted.
export function tierOf(member) {
  if (typeof member.tier === 'number') return TIERS[member.tier - 1] || 'member'
  return TIERS.includes(member.tier) ? member.tier : 'member'
}

// Leadership first, then leads, then members; the Studio's display order is kept within each tier
export function byTier(members) {
  return [...members].sort((a, b) => TIERS.indexOf(tierOf(a)) - TIERS.indexOf(tierOf(b)))
}
