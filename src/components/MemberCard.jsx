import { urlFor } from '../lib/sanity'
import './MemberCard.css'

export default function MemberCard({ member }) {
  return (
    <article className="member-card">
      <img
        src={member.photo ? urlFor(member.photo).width(300).height(300).url() : '/placeholder-photo.svg'}
        alt={member.name}
        className="member-card__photo"
      />
      <div className="member-card__info">
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__role">{member.role}</p>
        {member.bio && <p className="member-card__bio">{member.bio}</p>}
        {member.resumeUrl && (
          <a
            href={member.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="member-card__resume"
          >
            View Resume ↗
          </a>
        )}
      </div>
    </article>
  )
}
