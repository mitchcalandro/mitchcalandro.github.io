import './DonateBox.css'

function withAmount(url, amount) {
  return `${url}${url.includes('?') ? '&' : '?'}amount=${amount}`
}

export default function DonateBox({ url, tiers = [] }) {
  if (!url) {
    return <p className="donate-box__empty">Donation link coming soon.</p>
  }

  return (
    <div className="donate-box">
      <h2 className="donate-box__title">Support the build</h2>
      <p className="donate-box__lede">
        Every contribution goes toward parts, propellant, and test hardware.
      </p>

      {tiers.length > 0 && (
        <ul className="donate-box__tiers">
          {tiers.map((tier) => (
            <li key={tier.amount}>
              <a
                className="donate-box__tier"
                href={withAmount(url, tier.amount)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="donate-box__amount">${tier.amount}</span>
                {tier.note && <span className="donate-box__note">{tier.note}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}

      <a className="btn-primary donate-box__cta" href={url} target="_blank" rel="noopener noreferrer">
        Donate on GoFundMe →
      </a>

      <p className="donate-box__fineprint">
        Donations are processed securely by GoFundMe. You can choose your own amount and leave a
        message on their page.
      </p>
    </div>
  )
}
