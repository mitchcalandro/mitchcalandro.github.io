import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, croppedImageUrl } from '../lib/sanity'
import { byTier } from '../lib/tiers'
import './MembersPreview.css'

export default function MembersPreview() {
  const { data: members } = useSanityFetch(queries.members)

  return (
    <div className="members-preview">
      <div className="members-preview__grid">
        {byTier(members || []).map((m) => (
          // Opens the Members page at this person's full card
          <Link key={m._id} to={`/members#${m._id}`} className="members-preview__item">
            <img
              className="members-preview__photo"
              src={m.photo ? croppedImageUrl(m.photo, 200, 250) : '/placeholder-photo.svg'}
              alt=""
            />
            <span className="members-preview__name">{m.name}</span>
          </Link>
        ))}
      </div>
      <Link to="/members" className="members-preview__more">See more →</Link>
    </div>
  )
}
