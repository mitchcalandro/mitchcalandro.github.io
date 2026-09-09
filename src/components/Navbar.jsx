import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Project Aurelian' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/members', label: 'Members' },
  { to: '/support', label: 'Support Us' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
        PROJECT AURELIAN
      </Link>

      <button
        className="navbar__burger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        ☰
      </button>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {NAV_ITEMS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
