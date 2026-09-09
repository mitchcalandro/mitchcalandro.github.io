import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import PhaseTimeline from '../components/PhaseTimeline'
import NewsletterCard from '../components/NewsletterCard'
import NewsletterModal from '../components/NewsletterModal'
import FaqAccordion from '../components/FaqAccordion'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './HomePage.css'

export default function HomePage() {
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const { data: recent } = useSanityFetch(queries.newsletterRecent)
  const [selected, setSelected] = useState(null)

  return (
    <div className="home">
      <HeroSection />

      <section className="home__section section-container">
        <h2 className="section-title">Current Focus</h2>
        {settings?.currentPhase?.name ? (
          <Link to="/project" className="home__current-phase">
            {settings.currentPhase.name} →
          </Link>
        ) : (
          <p className="section-subtitle">Phase details coming soon.</p>
        )}
        <PhaseTimeline />
      </section>

      <section className="home__section section-container">
        <h2 className="section-title">Latest Newsletters</h2>
        <div className="home__newsletter-grid">
          {recent?.map((entry) => (
            <NewsletterCard key={entry._id} entry={entry} onReadMore={setSelected} />
          ))}
        </div>
        {(!recent || recent.length === 0) && (
          <p className="section-subtitle">First newsletter coming soon.</p>
        )}
        <Link to="/newsletter" className="home__catch-up">Read past issues →</Link>
      </section>

      <section className="home__section section-container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <FaqAccordion />
      </section>

      {selected && <NewsletterModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
