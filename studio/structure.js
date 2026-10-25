// Sidebar for the Studio. Each list is sorted the same way the website shows it,
// so the order you see here is the order visitors see.

const BY_ORDER = [{ field: 'order', direction: 'asc' }]

// How each list is sorted. Types not listed here keep the Studio's default sort.
const ORDERED_TYPES = {
  phase: BY_ORDER,
  faq: BY_ORDER,
  galleryItem: BY_ORDER,
  contactInfo: BY_ORDER,
  newsletter: [
    { field: 'year', direction: 'desc' },
    { field: 'month', direction: 'desc' },
  ],
}

// The Members page groups people by tier, then sorts each tier by Display Order.
// A member with no tier shows up with the general members, as on the site.
const MEMBER_TIERS = [
  { id: 'leadership', title: 'Leadership', filter: 'tier == "leadership"' },
  { id: 'lead', title: 'Discipline Leads', filter: 'tier == "lead"' },
  { id: 'member', title: 'Members', filter: 'tier == "member" || !defined(tier)' },
]

function membersItem(S) {
  return S.documentTypeListItem('member').child(
    S.list()
      .title('Team Members')
      .items([
        ...MEMBER_TIERS.map((t) =>
          S.listItem()
            .id(`members-${t.id}`)
            .title(t.title)
            .schemaType('member')
            .child(
              S.documentList()
                .id(`members-${t.id}`)
                .title(t.title)
                .schemaType('member')
                .filter(`_type == "member" && (${t.filter})`)
                .defaultOrdering(BY_ORDER),
            ),
        ),
        S.divider(),
        S.listItem()
          .id('members-all')
          .title('All members (A–Z)')
          .schemaType('member')
          .child(S.documentTypeList('member').title('All members').defaultOrdering([{ field: 'name', direction: 'asc' }])),
      ]),
  )
}

// Keeps the sidebar in schema order and only swaps in the sorted lists
export function structure(S) {
  return S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().map((item) => {
        const type = item.getId()
        if (type === 'member') return membersItem(S)
        if (ORDERED_TYPES[type]) {
          return S.documentTypeListItem(type).child(
            S.documentTypeList(type).defaultOrdering(ORDERED_TYPES[type]),
          )
        }
        return item
      }),
    )
}
