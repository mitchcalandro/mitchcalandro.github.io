import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, croppedImageUrl, fullImageUrl, logoUrl } from '../lib/sanity'
import RichText from './RichText'
import './HeroSection.css'

// The photo stretches to the paragraph's height, so the browser does the final crop; this keeps
// the Studio hotspot in view (hotspot is measured on the whole image, the URL is already cropped)
function focusPoint({ hotspot, crop }) {
  if (!hotspot) return '50% 50%'
  const c = { top: 0, bottom: 0, left: 0, right: 0, ...crop }
  const x = (hotspot.x - c.left) / (1 - c.left - c.right)
  const y = (hotspot.y - c.top) / (1 - c.top - c.bottom)
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`
}

export default function HeroSection() {
  const { data } = useSanityFetch(queries.siteSettings)
  const { data: phases } = useSanityFetch(queries.phases)
  const { data: members } = useSanityFetch(queries.members)

  const phaseList = Array.isArray(phases) ? phases : []
  const phaseIndex = phaseList.findIndex((p) => p._id === data?.currentPhase?._id)
  const teamSize = Array.isArray(members) ? members.length : 0

  return (
    <section id="home" className="hero">
      <div className="hero__inner section-container">
        <header className="hero__header">
          <div>
            <h1 className="hero__headline hero__reveal">{data?.heroHeadline || 'Project Aurelian'}</h1>
            <p className="hero__tagline hero__reveal"><RichText inline value={data?.heroTagline || 'Student-Led Liquid Rocketry'} /></p>
          </div>
          {data?.logo && (
            <div className="hero__logo-slot">
              <img className="hero__logo hero__reveal" src={logoUrl(data.logo, 800)} alt="Project Aurelian logo" />
            </div>
          )}
        </header>

        {(phaseIndex >= 0 || teamSize > 0) && (
          <dl className="hero__status hero__reveal">
            {phaseIndex >= 0 && (
              <>
                <div className="hero__stat">
                  <dt>Current phase</dt>
                  <dd><Link to="/project">{data.currentPhase.name}</Link></dd>
                </div>
                <div className="hero__stat hero__stat--progress">
                  <dt>Progress</dt>
                  <dd>
                    <span className="hero__bar" aria-hidden="true">
                      <span style={{ width: `${((phaseIndex + 1) / phaseList.length) * 100}%` }} />
                    </span>
                    {phaseIndex + 1} of {phaseList.length} phases
                  </dd>
                </div>
              </>
            )}
            {teamSize > 0 && (
              <div className="hero__stat">
                <dt>Team</dt>
                <dd><Link to="/members">{teamSize} members</Link></dd>
              </div>
            )}
          </dl>
        )}

        <div className="hero__about">
          <div className="hero__media hero__reveal">
            <img
              className="hero__image"
              src={data?.heroImage ? croppedImageUrl(data.heroImage, 1000, 1000) : '/placeholder-hero.svg'}
              alt="Project Aurelian rocket"
            />
          </div>
          <div className="hero__about-text hero__reveal">
            <h2 className="hero__subhead">Who are we?</h2>
            <div className="hero__lead rich-text">
              <RichText value={data?.whoWeAre || 'A bi-propellant liquid rocket, built from scratch.'} />
            </div>
            <div className="hero__actions">
              <Link to="/project" className="btn-primary">Learn More</Link>
              <Link to="/support" className="hero__secondary">Support the build →</Link>
            </div>
          </div>
        </div>

        {data?.ourBeginnings && (
          <div className={`hero__beginnings${data.beginningsImage?.asset ? ' hero__beginnings--photo' : ''}`}>
            <h2 className="hero__subhead">Our beginnings</h2>
            <div className="hero__text rich-text"><RichText value={data.ourBeginnings} /></div>
            {data.beginningsImage?.asset && (
              <div className="hero__beginnings-media">
                <img
                  className="hero__beginnings-image"
                  src={fullImageUrl(data.beginningsImage, 1200)}
                  style={{ objectPosition: focusPoint(data.beginningsImage) }}
                  alt={data.beginningsImage.alt || 'How Project Aurelian began'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
