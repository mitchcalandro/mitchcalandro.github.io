import { PortableText as BasePortableText } from '@portabletext/react'

// In the Studio a Shift+Enter line break at the start or end of a heading or paragraph, or an
// empty paragraph, looks like spacing but shows on the site as an uneven gap. Those are dropped
// so the gaps between blocks always come from the CSS. Breaks inside a paragraph are kept.
function trimEnd(children, pattern) {
  for (const span of children) {
    if (typeof span.text !== 'string') break
    span.text = span.text.replace(pattern, '')
    if (span.text) break
  }
}

export function tidyBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks
  return blocks
    .map((block) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return block
      const children = block.children.map((span) => ({ ...span }))
      trimEnd(children, /^\n+/)
      trimEnd([...children].reverse(), /\n+$/)
      return { ...block, children }
    })
    .filter((block) => block?._type !== 'block' || block.children?.some((span) => span.text !== ''))
}

// Drop-in for @portabletext/react's PortableText that tidies the blocks first
export function PortableText({ value, ...props }) {
  return <BasePortableText value={tidyBlocks(value)} {...props} />
}
