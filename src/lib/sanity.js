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
  siteSettings: `*[_type == "siteSettings"][0]{ heroHeadline, heroTagline, goFundMeUrl }`,
  newsletter: `*[_type == "newsletter"] | order(year desc, month desc){ _id, title, month, year, preview, body }`,
  about: `*[_type == "aboutContent"][0]{ body, featureBullets, photo }`,
  rocketSpecs: `*[_type == "rocketSpec"] | order(order asc){ _id, title, body }`,
  timeline: `*[_type == "timelineMilestone"] | order(year desc, month desc){ _id, month, year, goals }`,
  members: `*[_type == "member"] | order(order asc){ _id, name, role, photo, resumeUrl, bio }`,
  support: `*[_type == "supportContent"][0]{ body, goFundMeUrl, photo }`,
  contact: `*[_type == "contactInfo"] | order(order asc){ _id, name, role, email, linkedInUrl }`,
}
