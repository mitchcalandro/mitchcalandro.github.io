import PhotoCaption from './PhotoCaption'

// Photo with the offset outline (styled in index.css)
export default function PhotoFrame({ image, src, alt, className, imgClassName }) {
  return (
    <figure className={className}>
      <div className="photo-frame">
        <img className={imgClassName} src={src} alt={image?.alt || image?.caption || alt} />
      </div>
      <PhotoCaption image={image} />
    </figure>
  )
}
