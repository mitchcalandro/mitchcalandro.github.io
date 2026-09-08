import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import NewsletterSection from './components/NewsletterSection'
import AboutSection from './components/AboutSection'
import RocketSection from './components/RocketSection'
import TimelineSection from './components/TimelineSection'
import MembersSection from './components/MembersSection'
import SupportSection from './components/SupportSection'
import ContactSection from './components/ContactSection'
import FloatingDonateButton from './components/FloatingDonateButton'
import { useSanityFetch } from './hooks/useSanityFetch'
import { queries } from './lib/sanity'
import './App.css'

export default function App() {
  const { data: settings } = useSanityFetch(queries.siteSettings)

  return (
    <>
      <Navbar />
      <main className="app-main">
        <HeroSection />
        <NewsletterSection />
        <AboutSection />
        <RocketSection />
        <TimelineSection />
        <MembersSection />
        <SupportSection />
        <ContactSection />
      </main>
      <FloatingDonateButton url={settings?.goFundMeUrl} />
    </>
  )
}
