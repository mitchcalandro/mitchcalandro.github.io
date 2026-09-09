import { useForm, ValidationError } from '@formspree/react'
import './ContactForm.css'

export default function ContactForm({ formspreeId }) {
  const [state, handleSubmit] = useForm(formspreeId || 'placeholder')

  if (!formspreeId) return null

  if (state.succeeded) {
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
      <ValidationError prefix="Name" field="name" errors={state.errors} />

      <label className="contact-form__label" htmlFor="contact-email">Your Email</label>
      <input className="contact-form__input" id="contact-email" type="email" name="email" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      <label className="contact-form__label" htmlFor="contact-message">Message</label>
      <textarea className="contact-form__input contact-form__textarea" id="contact-message" name="message" rows="6" required />
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <button className="btn-primary contact-form__submit" type="submit" disabled={state.submitting}>
        {state.submitting ? 'Sending…' : 'Send Message'}
      </button>

      {state.errors && (
        <p className="contact-form__error">
          Something went wrong. Please email us directly using the addresses below.
        </p>
      )}
    </form>
  )
}
