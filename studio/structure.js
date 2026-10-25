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

// Keeps the sidebar in schema order and only swaps in the sorted lists
export function structure(S) {
  return S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().map((item) => {
        const type = item.getId()
        if (ORDERED_TYPES[type]) {
          return S.documentTypeListItem(type).child(
            S.documentTypeList(type).defaultOrdering(ORDERED_TYPES[type]),
          )
        }
        return item
      }),
    )
}
