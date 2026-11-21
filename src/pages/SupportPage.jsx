import { PortableText } from '../lib/portableText'
import DonateBox from '../components/DonateBox'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import { DEFAULT_DONATE_URL } from '../lib/constants'
import './SupportPage.css'

export default function SupportPage() {
  const { data } = useSanityFetch(queries.support)

  return (
    <div className="support-page page">
      <h1 className="section-title">Support Us</h1>
      {data?.body?.length > 0 && (
        <div className="support-page__body rich-text"><PortableText value={data.body} /></div>
      )}
      <DonateBox url={data?.goFundMeUrl || DEFAULT_DONATE_URL} />
    </div>
  )
}
