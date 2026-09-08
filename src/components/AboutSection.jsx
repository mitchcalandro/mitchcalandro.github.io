import { PortableText } from '@portabletext/react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, urlFor } from '../lib/sanity'
import './AboutSection.css'

export default function AboutSection() {
  const { data } = useSanityFetch(queries.about)

  return (
    <section id="about">
      <div className="section-container about__grid">
        <div className="about__text">
          <h2 className="section-title">About Project Aurelian</h2>
          {data?.body?.length > 0
            ? <div className="about__body"><PortableText value={data.body} /></div>
            : <p className="about__placeholder">Project description coming soon.</p>
          }
          {data?.featureBullets?.length > 0 && (
            <ul className="about__bullets">
              {data.featureBullets.map((bullet, i) => (
                <li key={i} className="about__bullet">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="about__photo-wrap">
          <img
            src={data?.photo ? urlFor(data.photo).width(600).url() : '/placeholder-photo.svg'}
            alt="Project Aurelian rocket"
            className="about__photo"
          />
        </div>
      </div>
    </section>
  )
}
