import { useState } from 'react'
import './ContactForm.css'

const ENDPOINT = 'https://api.web3forms.com/submit'
const SUBJECT = 'New message from the Project Aurelian site'

export default function ContactForm({ accessKey }) {
  const [status, setStatus] = useState('idle')

  if (!accessKey) return null

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')

    const form = new FormData(event.target)
    if (form.get('botcheck')) return

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: SUBJECT,
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
        }),
      })
      const result = await res.json()
      setStatus(result.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="contact-form__success">
        Thank you — your message has been sent. We usually reply within 48 hours.
      </p>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="contact-form__label" htmlFor="contact-name">Your Name</label>
      <input className="contact-form__input" id="contact-name" type="text" name="name" required />

      <label className="contact-form__label" htmlFor="contact-email">Your Email</label>
      <input className="contact-form__input" id="contact-email" type="email" name="email" required />

      <label className="contact-form__label" htmlFor="contact-message">Message</label>
      <textarea className="contact-form__input contact-form__textarea" id="contact-message" name="message" rows="6" required />

      <input type="checkbox" name="botcheck" className="contact-form__botcheck" tabIndex="-1" autoComplete="off" />

      <button className="btn-primary contact-form__submit" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="contact-form__error">
          Something went wrong. Please email us directly using the addresses below.
        </p>
      )}
    </form>
  )
}
