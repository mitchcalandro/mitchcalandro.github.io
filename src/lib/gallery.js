const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// Turns the gallery query result into one entry per image. An image posted in
// several places appears once and lists every place it was posted. Anything
// that is also a member photo is left out.
export function buildGallery(data) {
  if (!data) return []
  const memberPhotos = new Set(data.memberPhotos || [])
  const byAsset = new Map()

  const add = (asset, source) => {
    if (!asset?._id || memberPhotos.has(asset._id)) return
    if (!byAsset.has(asset._id)) byAsset.set(asset._id, { asset, sources: [] })
    byAsset.get(asset._id).sources.push(source)
  }

  data.items?.forEach((it) => add(it.asset, {
    type: 'gallery',
    key: `gallery-${it._id}`,
    label: it.phase ? `Gallery · ${it.phase.name}` : 'Gallery',
    title: it.caption,
    text: it.description,
    phase: it.phase,
  }))

  data.phases?.forEach((p) => p.images?.forEach((img) => add(img.asset, {
    type: 'phase',
    key: `phase-${p._id}`,
    label: 'Project phase',
    title: p.name,
    text: p.shortDescription,
    phase: { _id: p._id, name: p.name },
  })))

  data.newsletters?.forEach((n) => n.images?.forEach((img) => add(img.asset, {
    type: 'newsletter',
    key: `newsletter-${n._id}`,
    label: `Newsletter · ${MONTHS[(n.month ?? 1) - 1]} ${n.year}`,
    title: n.title,
    text: n.preview,
    newsletter: n,
  })))

  data.project?.images?.forEach((img) => add(img.asset, {
    type: 'project',
    key: 'project',
    label: 'Project Aurelian',
    title: 'Project write-up',
  }))

  return [...byAsset.values()]
}

export function isInPhase(entry, phaseId) {
  return entry.sources.some((s) => s.phase?._id === phaseId)
}

// The best one-line caption for the grid: a gallery caption, else where it was posted
export function captionFor(entry) {
  const named = entry.sources.find((s) => s.title)
  return named ? named.title : entry.sources[0]?.label
}
