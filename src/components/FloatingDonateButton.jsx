import './FloatingDonateButton.css'

export default function FloatingDonateButton({ url }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-donate"
      aria-label="Donate to Project Aurelian"
    >
      Donate ♥
    </a>
  )
}
