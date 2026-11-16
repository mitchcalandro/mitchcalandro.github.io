import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, croppedImageUrl } from '../lib/sanity'
import RichText from './RichText'
import './HeroSection.css'

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
            <img className="hero__logo hero__reveal" src={croppedImageUrl(data.logo, 320, 320)} alt="Project Aurelian logo" />
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
          <div className="hero__beginnings">
            <h2 className="hero__subhead">Our beginnings</h2>
            <div className="hero__text rich-text"><RichText value={data.ourBeginnings} /></div>
          </div>
        )}
      </div>
    </section>
  )
}
