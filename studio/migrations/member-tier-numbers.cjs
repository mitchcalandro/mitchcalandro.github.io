// One-off: converts member tiers from names to numbers (leadership 1, lead 2, member 3)
// so the Studio can sort members by role. Run from the studio folder:
//   npx sanity exec migrations/member-tier-numbers.cjs --with-user-token           (dry run)
//   APPLY=1 npx sanity exec migrations/member-tier-numbers.cjs --with-user-token   (writes)
const { getCliClient } = require('sanity/cli')

const RANK = { leadership: 1, lead: 2, member: 3 }
const client = getCliClient({ apiVersion: '2024-01-01' })
const apply = process.env.APPLY === '1'

async function main() {
const docs = await client.fetch('*[_type == "member" && defined(tier) && tier in ["leadership", "lead", "member"]]{_id, name, tier}')
const tx = client.transaction()
for (const d of docs) {
  console.log(`${d.name.padEnd(20)} ${d.tier} -> ${RANK[d.tier]}`)
  tx.patch(d._id, (p) => p.set({ tier: RANK[d.tier] }))
}
if (apply && docs.length) {
  const res = await tx.commit()
  console.log(`Updated ${res.documentIds.length} documents`)
} else {
  console.log(`${docs.length} documents would change (dry run)`)
}
}
main().catch((e) => { console.error(e); process.exit(1) })
