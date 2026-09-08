import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'about', label: 'About' },
  { id: 'rocket', label: 'Rocket' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'members', label: 'Members' },
  { id: 'support', label: 'Support Us' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observers = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <span className="navbar__logo">PROJECT AURELIAN</span>

      <button
        className="navbar__burger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        ☰
      </button>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`navbar__link ${activeSection === id ? 'navbar__link--active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
