import { useState } from 'react'
import { PortableText, toPlainText } from '@portabletext/react'
import { croppedImageUrl } from '../lib/sanity'
import './MemberCard.css'

// Photos are 4:3, except leadership, which is a 4:5 portrait beside the text (see MemberCard.css).
// Leadership cards stack on phones, so they get a separate 4:3 crop there.
// Sizes are roughly twice the on-screen size so photos stay sharp on high-DPI screens.
// Lead and member cards widen when a row isn't full: leads up to about 410px, members 350px.
const PHOTO_SIZES = {
  leadership: [760, 950],
  lead: [880, 660],
  member: [720, 540],
}

// Longer About Me / Contributions / Future Aspirations text is cut to this many characters until "Show more"
export const PREVIEW_CHARS = 200

function truncate(text, limit) {
  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '')}…`
}

// Shows a short preview of `text`; `children` is the full version revealed by "Show more"
function ShowMore({ text, children }) {
  const [expanded, setExpanded] = useState(false)
  if (text.length <= PREVIEW_CHARS) return children

  return (
    <>
      {expanded ? children : <p>{truncate(text, PREVIEW_CHARS)}</p>}
      <button className="member-card__more" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </>
  )
}

function RichTextBlock({ label, value }) {
  return (
    <div className="member-card__block">
      <h4 className="member-card__label">{label}</h4>
      <div className="member-card__rt">
        <ShowMore text={toPlainText(value)}><PortableText value={value} /></ShowMore>
      </div>
    </div>
  )
}

export default function MemberCard({ member, tier = 'member' }) {
  const [width, height] = PHOTO_SIZES[tier] || PHOTO_SIZES.member

  return (
    <article className={`member-card member-card--${tier}`}>
      <picture>
        {member.photo && tier === 'leadership' && (
          <source media="(max-width: 760px)" srcSet={croppedImageUrl(member.photo, 800, 600)} />
        )}
        <img
          src={member.photo ? croppedImageUrl(member.photo, width, height) : '/placeholder-photo.svg'}
          alt={member.name}
          className="member-card__photo"
        />
      </picture>
      <div className="member-card__info">
        <p className="member-card__role">{member.role}</p>
        <h3 className="member-card__name">{member.name}</h3>

        {member.bio && (
          <div className="member-card__bio">
            <ShowMore text={member.bio}><p>{member.bio}</p></ShowMore>
          </div>
        )}

        {member.contributions?.length > 0 && (
          <RichTextBlock label="Contributions" value={member.contributions} />
        )}

        {member.futureAspirations?.length > 0 && (
          <RichTextBlock label="Future Aspirations" value={member.futureAspirations} />
        )}

        <div className="member-card__links">
          {member.resumeUrl && (
            <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">Resume ↗</a>
          )}
          {member.portfolioUrl && (
            <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="member-card__link">Portfolio ↗</a>
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
