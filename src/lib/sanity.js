import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '59rhnpdt',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]{
    heroHeadline, heroTagline, goFundMeUrl, projectBody, lastUpdated, footerText,
    currentPhase->{ _id, name, order }
  }`,
  newsletter: `*[_type == "newsletter"] | order(year desc, month desc){ _id, title, month, year, preview, body }`,
  newsletterRecent: `*[_type == "newsletter"] | order(year desc, month desc)[0...4]{ _id, title, month, year, preview, body }`,
  phases: `*[_type == "phase"] | order(order asc){ _id, name, order, shortDescription, body, images }`,
  faqs: `*[_type == "faq"] | order(order asc){ _id, question, answer }`,
  members: `*[_type == "member"] | order(order asc){ _id, name, role, photo, resumeUrl, bio, contributions, futureAspirations, githubUrl, linkedInUrl, email }`,
  support: `*[_type == "supportContent"][0]{ body, goFundMeUrl, photo }`,
  contact: `*[_type == "contactInfo"] | order(order asc){ _id, name, role, email, linkedInUrl, githubUrl, photo }`,
  gallery: `*[_type == "galleryItem"] | order(order asc){ _id, image, caption, phase->{ _id, name } }`,
}
