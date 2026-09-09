import { PortableText } from '@portabletext/react'
import DonateBox from '../components/DonateBox'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './SupportPage.css'

export default function SupportPage() {
  const { data } = useSanityFetch(queries.support)

  return (
    <div className="support-page page">
      <h1 className="section-title">Support Us</h1>
      <div className="support-page__body">
        {data?.body?.length > 0
          ? <PortableText value={data.body} />
          : <p className="section-subtitle">Your support helps us build. Details coming soon.</p>}
      </div>
      <DonateBox url={data?.goFundMeUrl} tiers={data?.donationTiers || []} />
    </div>
  )
}
