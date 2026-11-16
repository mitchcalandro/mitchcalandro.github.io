import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import Modal from './Modal'
import RichText from './RichText'
import { croppedImageUrl } from '../lib/sanity'
import './MemberCard.css'

// Photos are 4:5 portraits in every tier, matching how headshots are cropped in the Studio,
// so the whole headshot shows (see MemberCard.css). Sizes are roughly twice the on-screen
// size so photos stay sharp on high-DPI screens.
const PHOTO_SIZES = {
  leadership: [960, 1200],
  lead: [720, 900],
  member: [640, 800],
}

function AboutMe({ member, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="member-about">
        <p className="member-card__role">{member.role}</p>
        <h2 className="member-about__name">{member.name}</h2>
        {member.bio && (
          <div className="member-about__block">
            <h4 className="member-card__label">About Me</h4>
            <div className="rich-text"><RichText value={member.bio} /></div>
          </div>
        )}
        {member.contributions?.length > 0 && (
          <div className="member-about__block">
            <h4 className="member-card__label">Contributions</h4>
            <div className="rich-text"><PortableText value={member.contributions} /></div>
          </div>
        )}
        {member.futureAspirations?.length > 0 && (
          <div className="member-about__block">
            <h4 className="member-card__label">Future Aspirations</h4>
            <div className="rich-text"><PortableText value={member.futureAspirations} /></div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default function MemberCard({ member, tier = 'member' }) {
  const [width, height] = PHOTO_SIZES[tier] || PHOTO_SIZES.member
  const [aboutOpen, setAboutOpen] = useState(false)
  const hasAbout = member.bio || member.contributions?.length > 0 || member.futureAspirations?.length > 0

  return (
    <article className={`member-card member-card--${tier}`}>
      <img
        src={member.photo ? croppedImageUrl(member.photo, width, height) : '/placeholder-photo.svg'}
        alt={member.name}
        className="member-card__photo"
      />
      <div className="member-card__heading">
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__role">{member.role}</p>
      </div>

      <div className="member-card__links">
        {member.resumeUrl && (
          <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">LinkedIn ↗</a>
        )}
        {member.portfolioUrl && (
          <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">Portfolio ↗</a>
        )}
        {member.githubUrl && (
          <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">GitHub</a>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} className="member-card__link">Email</a>
        )}
        {hasAbout && (
          <button className="member-card__about" onClick={() => setAboutOpen(true)}>About Me →</button>
        )}
      </div>

      {aboutOpen && <AboutMe member={member} onClose={() => setAboutOpen(false)} />}
    </article>
  )
}
