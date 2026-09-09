import { PortableText } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import './MemberCard.css'

export default function MemberCard({ member, tier = 'member' }) {
  return (
    <article className={`member-card member-card--${tier}`}>
      <img
        src={member.photo ? urlFor(member.photo).width(300).height(300).url() : '/placeholder-photo.svg'}
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
