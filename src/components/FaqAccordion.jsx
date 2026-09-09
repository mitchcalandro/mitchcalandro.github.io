import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { queries } from '../lib/sanity'
import './FaqAccordion.css'

export default function FaqAccordion() {
  const { data: faqs } = useSanityFetch(queries.faqs)
  const [openId, setOpenId] = useState(null)

  if (!faqs || faqs.length === 0) {
    return <p className="faq__empty">No questions yet — check back soon.</p>
  }

  return (
    <div className="faq">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id
        return (
          <div key={faq._id} className="faq__item">
            <button
              className="faq__question"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : faq._id)}
            >
              <span>{faq.question}</span>
              <span className="faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="faq__answer">
                {faq.answer?.length > 0
                  ? <PortableText value={faq.answer} />
                  : <p>Answer coming soon.</p>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
