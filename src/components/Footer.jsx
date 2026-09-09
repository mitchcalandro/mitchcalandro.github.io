import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './Footer.css'

export default function Footer() {
  const { data: settings } = useSanityFetch(queries.siteSettings)
  const footerText = settings?.footerText || 'Project Aurelian'

  return (
    <footer className="site-footer" data-testid="footer">
      {settings?.lastUpdated && (
        <p className="site-footer__updated">Last Updated: {settings.lastUpdated}</p>
      )}
      <p className="site-footer__copy">© 2026 {footerText}</p>
    </footer>
  )
}
