import { PortableText } from '@portabletext/react'
import { croppedImageUrl } from '../lib/sanity'
import './MemberCard.css'

// Must match the aspect-ratio of .member-card__photo for each tier in MemberCard.css.
// Sizes are roughly twice the largest on-screen size so photos stay sharp on high-DPI screens.
const PHOTO_SIZES = {
  leadership: [800, 600],
  lead: [600, 600],
  member: [480, 480],
}

export default function MemberCard({ member, tier = 'member' }) {
  const [width, height] = PHOTO_SIZES[tier] || PHOTO_SIZES.member

  return (
    <article className={`member-card member-card--${tier}`}>
      <img
        src={member.photo ? croppedImageUrl(member.photo, width, height) : '/placeholder-photo.svg'}
        alt={member.name}
        className="member-card__photo"
      />
      <div className="member-card__info">
        <p className="member-card__role">{member.role}</p>
        <h3 className="member-card__name">{member.name}</h3>

        {member.bio && <p className="member-card__bio">{member.bio}</p>}

        {member.contributions?.length > 0 && (
          <div className="member-card__block">
            <h4 className="member-card__label">Contributions</h4>
            <div className="member-card__rt"><PortableText value={member.contributions} /></div>
          </div>
        )}

        {member.futureAspirations?.length > 0 && (
          <div className="member-card__block">
            <h4 className="member-card__label">Future Aspirations</h4>
            <div className="member-card__rt"><PortableText value={member.futureAspirations} /></div>
          </div>
        )}

        <div className="member-card__links">
          {member.resumeUrl && (
            <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">Resume ↗</a>
          )}
          {member.linkedInUrl && (
            <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">LinkedIn</a>
          )}
          {member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">GitHub</a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="member-card__link">Email</a>
          )}
        </div>
      </div>
    </article>
  )
}
