import './DonateBox.css'

export default function DonateBox({ url }) {
  return (
    <div className="donate-box">
      <h2 className="donate-box__title">Support the build</h2>
      <p className="donate-box__lede">
        Every contribution goes toward parts, propellant, and test hardware.
      </p>

      <a className="btn-primary donate-box__cta" href={url} target="_blank" rel="noopener noreferrer">
        Donate on GoFundMe →
      </a>

      <p className="donate-box__fineprint">
        Donations are processed securely by GoFundMe. You choose your amount and can leave a
        message on their page.
      </p>
    </div>
  )
}
