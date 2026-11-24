// Sidebar for the Studio. Each list is sorted by the field that sets its order on the
// website (role then Display Order for members, Order, or newest first for newsletters).

const BY_ORDER = [{ field: 'order', direction: 'asc' }]

// How each list is sorted. Types not listed here keep the Studio's default sort.
const ORDERED_TYPES = {
  member: [{ field: 'tier', direction: 'asc' }, ...BY_ORDER, { field: 'name', direction: 'asc' }],
  phase: BY_ORDER,
  faq: BY_ORDER,
  galleryItem: BY_ORDER,
  contactInfo: BY_ORDER,
  newsletter: [
    { field: 'year', direction: 'desc' },
    { field: 'month', direction: 'desc' },
  ],
}

const sortedList = (S, type) => S.documentTypeList(type).defaultOrdering(ORDERED_TYPES[type])

// Contact opens to the page photo (a single document) and the list of people
const contactItems = (S) => S.list()
  .title('Contact')
  .items([
    S.listItem()
      .id('contactPage')
      .title('Contact page photo')
      .schemaType('contactPage')
      .child(S.document().schemaType('contactPage').documentId('contactPage')),
    S.documentTypeListItem('contactInfo').title('People').child(sortedList(S, 'contactInfo').title('People')),
  ])

// Keeps the sidebar in schema order and only swaps in the sorted lists
export function structure(S) {
  return S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().filter((item) => item.getId() !== 'contactPage').map((item) => {
        const type = item.getId()
        if (type === 'contactInfo') return S.documentTypeListItem(type).child(contactItems(S))
        if (ORDERED_TYPES[type]) return S.documentTypeListItem(type).child(sortedList(S, type))
        return item
      }),
    )
}
