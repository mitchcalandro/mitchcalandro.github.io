import { useForm, ValidationError } from '@formspree/react'
import './ContactForm.css'

export default function ContactForm({ formspreeId }) {
  const [state, handleSubmit] = useForm(formspreeId || 'placeholder')

  if (!formspreeId) return null

  if (state.succeeded) {
    return <p className="contact-form__success">Thank you — your message has been sent.</p>
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="contact-form__label" htmlFor={`name-${formspreeId}`}>Name</label>
      <input className="contact-form__input" id={`name-${formspreeId}`} type="text" name="name" required />

      <label className="contact-form__label" htmlFor={`email-${formspreeId}`}>Email</label>
      <input className="contact-form__input" id={`email-${formspreeId}`} type="email" name="email" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      <label className="contact-form__label" htmlFor={`message-${formspreeId}`}>Message</label>
      <textarea className="contact-form__input" id={`message-${formspreeId}`} name="message" rows="4" required />
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <button className="btn-primary contact-form__submit" type="submit" disabled={state.submitting}>
        {state.submitting ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
