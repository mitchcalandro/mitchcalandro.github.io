import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/sanity', () => ({ urlFor: () => ({ width: () => ({ height: () => ({ url: () => '/p.svg' }) }) }) }))
import MemberCard from '../components/MemberCard'

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
})
