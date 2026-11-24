import { fullImageUrl } from '../lib/sanity'
import './WithPhoto.css'

// The photo stretches to the text's height, so the browser does the final crop; this keeps
// the Studio hotspot in view (hotspot is measured on the whole image, the URL is already cropped)
function focusPoint({ hotspot, crop }) {
  if (!hotspot) return '50% 50%'
  const c = { top: 0, bottom: 0, left: 0, right: 0, ...crop }
  const x = (hotspot.x - c.left) / (1 - c.left - c.right)
  const y = (hotspot.y - c.top) / (1 - c.top - c.bottom)
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`
}

// Text with a photo box on its right; just the text when no photo is set
export default function WithPhoto({ image, alt, children }) {
  if (!image?.asset) return children
  return (
    <div className="with-photo">
      {children}
      <div className="with-photo__media">
        <img
          className="with-photo__image"
          src={fullImageUrl(image, 1200)}
          style={{ objectPosition: focusPoint(image) }}
          alt={image.alt || alt}
        />
      </div>
    </div>
  )
}
