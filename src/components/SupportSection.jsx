import { PortableText } from '@portabletext/react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, urlFor } from '../lib/sanity'
import './SupportSection.css'

export default function SupportSection() {
  const { data } = useSanityFetch(queries.support)

  return (
    <section id="support">
      <div className="section-container support__inner">
        <img
          src={data?.photo ? urlFor(data.photo).width(1200).url() : '/placeholder-photo.svg'}
          alt="Project Aurelian team"
          className="support__photo"
        />
        <div className="support__content">
          <h2 className="section-title">Support Us</h2>
          <div className="support__body">
            {data?.body?.length > 0
              ? <PortableText value={data.body} />
              : <p>Help us build the future of student rocketry. Every contribution matters.</p>
            }
          </div>
          {data?.goFundMeUrl
            ? (
              <a
                href={data.goFundMeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary support__donate-btn"
              >
                Donate on GoFundMe
              </a>
            )
            : (
              <p className="support__coming-soon">Donation link coming soon.</p>
            )
          }
        </div>
      </div>
    </section>
  )
}
