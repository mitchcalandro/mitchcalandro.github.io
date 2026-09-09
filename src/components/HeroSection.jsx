import { Link } from 'react-router-dom'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './HeroSection.css'

export default function HeroSection() {
  const { data } = useSanityFetch(queries.siteSettings)

  return (
    <section id="home" className="hero">
      <img
        className="hero__image"
        src="/placeholder-hero.svg"
        alt="Project Aurelian rocket"
      />
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__headline">
            {data?.heroHeadline || 'Project Aurelian'}
          </h1>
          <p className="hero__tagline">
            {data?.heroTagline || 'A bi-propellant liquid rocket, built from scratch.'}
          </p>
          <Link to="/project" className="btn-primary hero__cta">Learn More</Link>
        </div>
        <div className="hero__scroll-cue" aria-hidden="true">&#8964;</div>
      </div>
    </section>
  )
}
