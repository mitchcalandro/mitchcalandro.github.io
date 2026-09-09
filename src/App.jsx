import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingDonateButton from './components/FloatingDonateButton'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import NewsletterPage from './pages/NewsletterPage'
import MembersPage from './pages/MembersPage'
import SupportPage from './pages/SupportPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import { useSanityFetch } from './hooks/useSanityFetch'
import { queries } from './lib/sanity'
import { DEFAULT_DONATE_URL } from './lib/constants'
import './App.css'

export default function App() {
  const { data: settings } = useSanityFetch(queries.siteSettings)

  return (
    <>
      <Navbar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
      <Footer />
      <FloatingDonateButton url={settings?.goFundMeUrl || DEFAULT_DONATE_URL} />
    </>
  )
}
