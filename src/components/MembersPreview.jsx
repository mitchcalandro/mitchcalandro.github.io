import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, croppedImageUrl } from '../lib/sanity'
import './MembersPreview.css'

export default function MembersPreview() {
  const { data: members } = useSanityFetch(queries.members)

  return (
    <div className="members-preview">
      <div className="members-preview__grid">
        {members?.map((m) => (
          <div key={m._id} className="members-preview__item">
            <img
              className="members-preview__photo"
              src={m.photo ? croppedImageUrl(m.photo, 200, 200) : '/placeholder-photo.svg'}
              alt={m.name}
            />
            <span className="members-preview__name">{m.name}</span>
          </div>
        ))}
      </div>
      <Link to="/members" className="members-preview__more">See more →</Link>
    </div>
  )
}
