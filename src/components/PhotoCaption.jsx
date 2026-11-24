// Styled in index.css. Shows unless "Hide caption" is on in the Studio.
export default function PhotoCaption({ image }) {
  if (!image?.caption || image.hideCaption) return null
  return <figcaption className="photo-caption">{image.caption}</figcaption>
}
