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

// Fills an exact width x height box, honouring the crop and hotspot chosen in the Studio.
export function croppedImageUrl(image, width, height) {
  return builder.image(image).width(width).height(height).fit('crop').auto('format').url()
}

// Scales the whole image down to fit within `width` — never crops or stretches it.
export function fullImageUrl(image, width) {
  return builder.image(image).width(width).fit('max').auto('format').url()
}

const IMAGE_ASSET = '"asset": asset->{ _id, url, metadata { dimensions } }'

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]{
    heroHeadline, heroTagline, heroImage, goFundMeUrl, projectBody, lastUpdated, footerText, formspreeId,
    currentPhase->{ _id, name, order }
  }`,
  newsletter: `*[_type == "newsletter"] | order(year desc, month desc){ _id, title, month, year, preview, body }`,
  newsletterRecent: `*[_type == "newsletter"] | order(year desc, month desc)[0...4]{ _id, title, month, year, preview, body }`,
  phases: `*[_type == "phase"] | order(order asc){ _id, name, order, shortDescription, body, images }`,
  faqs: `*[_type == "faq"] | order(order asc){ _id, question, answer }`,
  members: `*[_type == "member"] | order(order asc){ _id, name, role, tier, photo, resumeUrl, portfolioUrl, bio, contributions, futureAspirations, githubUrl, linkedInUrl, email }`,
  support: `*[_type == "supportContent"][0]{ body, goFundMeUrl, photo }`,
  contact: `*[_type == "contactInfo"] | order(order asc){ _id, name, role, email, linkedInUrl, githubUrl, photo }`,
  // Every image posted anywhere on the site except member photos, grouped by where it was posted
  gallery: `{
    "memberPhotos": *[_type == "member" && defined(photo.asset)].photo.asset._ref,
    "items": *[_type == "galleryItem" && defined(image.asset)] | order(order asc){
      _id, caption, description, phase->{ _id, name },
      "asset": image.asset->{ _id, url, metadata { dimensions } }
    },
    "phases": *[_type == "phase"] | order(order asc){
      _id, name, shortDescription,
      "images": (coalesce(images, []) + coalesce(body[_type == "image"], []))[defined(asset)]{ ${IMAGE_ASSET} }
    },
    "newsletters": *[_type == "newsletter"] | order(year desc, month desc){
      _id, title, month, year, preview, body,
      "images": body[_type == "image" && defined(asset)]{ ${IMAGE_ASSET} }
    },
    "project": *[_type == "siteSettings"][0]{
      "images": projectBody[_type == "image" && defined(asset)]{ ${IMAGE_ASSET} }
    }
  }`,
}
