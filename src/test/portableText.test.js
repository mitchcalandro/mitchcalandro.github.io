import { describe, it, expect } from 'vitest'
import { tidyBlocks } from '../lib/portableText'

const block = (style, ...texts) => ({
  _type: 'block', style, markDefs: [],
  children: texts.map((text, i) => ({ _type: 'span', _key: `s${i}`, text, marks: [] })),
})
const text = (b) => b.children.map((s) => s.text).join('')

describe('tidyBlocks', () => {
  it('drops line breaks at the start and end of headings and paragraphs, keeping ones inside', () => {
    const out = tidyBlocks([block('h3', 'Why the Mojave Sphinx?\n'), block('normal', '\nFirst line\nsecond line\n\n')])
    expect(out.map(text)).toEqual(['Why the Mojave Sphinx?', 'First line\nsecond line'])
  })

  it('trims across spans when a break sits in its own span', () => {
    expect(text(tidyBlocks([block('normal', '\n', '\nBold start', ' end\n')])[0])).toBe('Bold start end')
  })

  it('removes empty paragraphs but keeps images and other blocks', () => {
    const image = { _type: 'image', asset: { _ref: 'image-1' } }
    const out = tidyBlocks([block('normal', 'Text'), block('normal', ''), block('normal', '\n'), image])
    expect(out).toHaveLength(2)
    expect(out[1]).toBe(image)
  })

  it('does not change the original data', () => {
    const original = [block('normal', '\nText')]
    tidyBlocks(original)
    expect(original[0].children[0].text).toBe('\nText')
  })
})
