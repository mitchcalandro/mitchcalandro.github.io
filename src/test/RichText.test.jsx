import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RichText from '../components/RichText'

const blocks = [
  { _type: 'block', _key: 'a', style: 'normal', markDefs: [], children: [
    { _type: 'span', _key: 'a1', text: 'Student-Led ', marks: [] },
    { _type: 'span', _key: 'a2', text: 'Liquid', marks: ['strong'] },
  ] },
  { _type: 'block', _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'b1', text: 'Rocketry', marks: ['em'] }] },
]

describe('RichText', () => {
  it('renders formatted Studio text as paragraphs with its bold and italics', () => {
    const { container } = render(<RichText value={blocks} />)
    expect(container.querySelectorAll('p')).toHaveLength(2)
    expect(container.querySelector('strong')).toHaveTextContent('Liquid')
    expect(container.querySelector('em')).toHaveTextContent('Rocketry')
  })

  it('joins paragraphs into one line when inline', () => {
    const { container } = render(<p><RichText inline value={blocks} /></p>)
    expect(container.querySelectorAll('p')).toHaveLength(1)
    expect(container.querySelector('p')).toHaveTextContent('Student-Led Liquid Rocketry')
    expect(container.querySelector('strong')).toBeInTheDocument()
  })

  it('still shows entries saved as plain text before the field was formatted', () => {
    expect(render(<RichText value="Old text" />).container.querySelector('p')).toHaveTextContent('Old text')
    expect(render(<span><RichText inline value="Old line" /></span>).container.querySelector('p')).toBeNull()
  })

  it('renders nothing when empty', () => {
    expect(render(<RichText value={null} />).container).toBeEmptyDOMElement()
  })
})
