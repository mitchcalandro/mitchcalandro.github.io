import { PortableText } from '../lib/portableText'

// One-line fields (taglines, phase descriptions) sit inside an existing line, so their
// paragraphs are joined instead of each getting its own <p>
const INLINE = { block: ({ children }) => <>{children} </> }

// Text formatted in the Studio (bold, italics, links...). Entries saved before a field
// became formatted are still plain strings until migrations/plain-text-to-formatted.cjs runs.
export default function RichText({ value, inline = false }) {
  if (!value) return null
  if (typeof value === 'string') return inline ? value : <p>{value}</p>
  return <PortableText value={value} components={inline ? INLINE : undefined} />
}
