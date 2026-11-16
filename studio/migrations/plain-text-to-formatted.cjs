// One-off: converts fields that changed from plain text to formatted text (bold, italics...)
// so the Studio can edit them. Each blank-line-separated paragraph becomes one paragraph.
// Run from the studio folder, after the website that reads both kinds is live:
//   npx sanity exec migrations/plain-text-to-formatted.cjs --with-user-token           (dry run)
//   APPLY=1 npx sanity exec migrations/plain-text-to-formatted.cjs --with-user-token   (writes)
const { randomUUID } = require('crypto')
const { getCliClient } = require('sanity/cli')

const FIELDS = {
  siteSettings: ['heroTagline', 'whoWeAre', 'ourBeginnings'],
  member: ['bio'],
  newsletter: ['preview'],
  phase: ['shortDescription'],
  galleryItem: ['description'],
}
const client = getCliClient({ apiVersion: '2024-01-01' })
const apply = process.env.APPLY === '1'
const key = () => randomUUID().slice(0, 12)

const toBlocks = (text) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
}))

async function main() {
  const tx = client.transaction()
  let count = 0
  for (const [type, fields] of Object.entries(FIELDS)) {
    // Includes drafts, so unpublished edits are converted too
    const docs = await client.fetch(`*[_type == $type]{_id, ${fields.join(', ')}}`, { type })
    for (const doc of docs) {
      const strings = fields.filter((f) => typeof doc[f] === 'string')
      if (!strings.length) continue
      const set = {}, unset = []
      for (const f of strings) {
        const blocks = toBlocks(doc[f])
        if (blocks.length) set[f] = blocks
        else unset.push(f)
        console.log(`${doc._id.padEnd(48)} ${f}: ${blocks.length} paragraph(s)`)
      }
      tx.patch(doc._id, (p) => p.set(set).unset(unset))
      count++
    }
  }
  if (apply && count) {
    const res = await tx.commit()
    console.log(`Updated ${res.documentIds.length} documents`)
  } else {
    console.log(`${count} documents would change (dry run)`)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
