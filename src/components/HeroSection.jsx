import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries, croppedImageUrl } from '../lib/sanity'
import './HeroSection.css'

export default function HeroSection() {
  const { data } = useSanityFetch(queries.siteSettings)

  return (
    <section id="home" className="hero">
      <div className="hero__inner section-container">
        <header className="hero__header">
          <h1 className="hero__headline">{data?.heroHeadline || 'Project Aurelian'}</h1>
          {data?.logo && (
            <img className="hero__logo" src={croppedImageUrl(data.logo, 320, 320)} alt="Project Aurelian logo" />
          )}
        </header>

        <div className="hero__about">
          <img
            className="hero__image"
            src={data?.heroImage ? croppedImageUrl(data.heroImage, 1000, 1000) : '/placeholder-hero.svg'}
            alt="Project Aurelian rocket"
          />
          <div className="hero__about-text">
            <h2 className="hero__subhead">Who are we?</h2>
            <p className="hero__text">
              {data?.whoWeAre || data?.heroTagline || 'A bi-propellant liquid rocket, built from scratch.'}
            </p>
            <Link to="/project" className="btn-primary">Learn More</Link>
          </div>
        </div>

        {data?.ourBeginnings && (
          <div className="hero__beginnings">
            <h2 className="hero__subhead">Our beginnings</h2>
            <p className="hero__text">{data.ourBeginnings}</p>
          </div>
        )}
      </div>
    </section>
  )
}
