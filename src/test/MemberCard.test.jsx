import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/sanity', () => ({ croppedImageUrl: vi.fn(() => '/p.svg') }))
import MemberCard from '../components/MemberCard'
import { croppedImageUrl } from '../lib/sanity'

const member = {
  name: 'Scott Meeson', role: 'Lead Engineer', photo: null,
  bio: 'Bio text', contributions: [{ _type: 'block', _key: 'c', children: [{ _type: 'span', text: 'Built engine.' }] }],
  futureAspirations: [{ _type: 'block', _key: 'f', children: [{ _type: 'span', text: 'Go to space.' }] }],
  resumeUrl: 'https://x.com/r.pdf', linkedInUrl: 'https://linkedin.com/in/x',
  githubUrl: 'https://github.com/x', email: 'scott@example.com',
}

describe('MemberCard', () => {
  it('renders all fields and social links', () => {
    render(<MemberCard member={member} />)
    expect(screen.getByText('Scott Meeson')).toBeInTheDocument()
    expect(screen.getByText('Lead Engineer')).toBeInTheDocument()
    expect(screen.getByText('Built engine.')).toBeInTheDocument()
    expect(screen.getByText('Go to space.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', 'https://x.com/r.pdf')
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:scott@example.com')
  })

  it('omits links that are not provided', () => {
    render(<MemberCard member={{ name: 'X', role: 'Y', photo: null }} />)
    expect(screen.queryByRole('link', { name: /resume/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
  })

  it('requests the photo in the exact shape of its tier box so the Studio crop is honoured', () => {
    const photo = { asset: { _ref: 'image-a' }, crop: { top: 0.1 }, hotspot: { x: 0.5, y: 0.3 } }
    render(<MemberCard member={{ name: 'L', role: 'R', photo }} tier="leadership" />)
    expect(croppedImageUrl).toHaveBeenLastCalledWith(photo, 800, 600)
    render(<MemberCard member={{ name: 'M', role: 'R', photo }} tier="member" />)
    expect(croppedImageUrl).toHaveBeenLastCalledWith(photo, 480, 480)
  })
})
