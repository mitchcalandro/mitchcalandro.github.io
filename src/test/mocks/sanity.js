import { vi } from 'vitest'

vi.mock('../../lib/sanity', () => ({
  client: { fetch: vi.fn().mockResolvedValue(null) },
  urlFor: vi.fn(() => ({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('/placeholder-photo.svg'),
  })),
  queries: {
    siteSettings: '',
    newsletter: '',
    about: '',
    rocketSpecs: '',
    timeline: '',
    members: '',
    support: '',
    contact: '',
  },
}))
