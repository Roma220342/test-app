// Fully mocked partner data — no backend, no persistence.
// Logos are inline SVG data URIs so the prototype has zero external asset
// dependencies. Partners with `logo: null` exercise the initials-avatar fallback.

const shellLogo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#FBCE07"/><path d="M20 7c-4 5-9 9-9 15a9 9 0 0018 0c0-6-5-10-9-15z" fill="#E00034"/></svg>`
  )

const fleetLogo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#1B2A4A"/><path d="M8 24h4l2-6h12l2 6h4v5H8v-5z" fill="#FFFFFF"/><circle cx="14" cy="30" r="2.5" fill="#FFFFFF"/><circle cx="26" cy="30" r="2.5" fill="#FFFFFF"/></svg>`
  )

const cardLogo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#0F5C4C"/><rect x="8" y="14" width="24" height="16" rx="2" fill="#FFFFFF"/><rect x="8" y="18" width="24" height="3" fill="#0F5C4C"/></svg>`
  )

const opsLogo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#4A2E86"/><circle cx="20" cy="20" r="9" fill="none" stroke="#FFFFFF" stroke-width="3"/><circle cx="20" cy="20" r="2.5" fill="#FFFFFF"/></svg>`
  )

export const PARTNER_STATUSES = ['Active', 'Inactive', 'Pending Review', 'Suspended']
export const PARTNER_TYPES = ['Internal', 'External']
export const BMO_TIMINGS = ['Immediate', 'Delayed']

// BMO limit is two independent facts — an amount ("No limit" or a size) and,
// only when an amount actually applies, a timing (Immediate/Delayed). Kept as
// separate fields (not one free-text string) so both are independently
// filterable/sortable instead of one being buried in parenthetical text.
export const initialPartners = [
  {
    id: 'p-001',
    code: '260904',
    name: 'Shell Retail Stores',
    type: 'Internal',
    status: 'Active',
    logo: shellLogo,
    createdAt: '2025-11-02',
    updatedAt: '2025-11-02',
    config: { bmoAmount: '10L', bmoTiming: 'Immediate', web: 'Yes', gift: 'Yes' },
  },
  {
    id: 'p-002',
    code: 'costa0142',
    name: 'Costa Coffee',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-10-18',
    updatedAt: '2025-10-18',
    config: { bmoAmount: '5L', bmoTiming: 'Immediate', web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-003',
    code: 'wtr0087',
    name: 'Waitrose Rewards',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-09-30',
    updatedAt: '2025-09-30',
    config: { bmoAmount: 'No limit', bmoTiming: null, web: 'Yes', gift: 'Yes' },
  },
  {
    id: 'p-004',
    code: 'mands2024',
    name: 'M&S Simply Food',
    type: 'External',
    status: 'Pending Review',
    logo: null,
    createdAt: '2026-01-14',
    updatedAt: '2026-01-14',
    config: { bmoAmount: '20L', bmoTiming: 'Immediate', web: 'No', gift: 'No' },
  },
  {
    id: 'p-005',
    code: 'flt55',
    name: 'Shell Fleet Solutions',
    type: 'Internal',
    status: 'Active',
    logo: fleetLogo,
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05',
    config: { bmoAmount: 'No limit', bmoTiming: null, web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-006',
    code: 'greggs11',
    name: 'Greggs Bakery',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-12-22',
    updatedAt: '2025-12-22',
    config: { bmoAmount: '2L', bmoTiming: 'Immediate', web: 'Yes', gift: 'Yes' },
  },
  {
    id: 'p-007',
    code: 'tescoexp09',
    name: 'Tesco Express',
    type: 'External',
    status: 'Inactive',
    logo: null,
    createdAt: '2025-05-11',
    updatedAt: '2025-05-11',
    config: { bmoAmount: '5L', bmoTiming: 'Delayed', web: 'No', gift: 'No' },
  },
  {
    id: 'p-008',
    code: 'costaexp3',
    name: 'Costa Express Kiosks',
    type: 'External',
    status: 'Suspended',
    logo: null,
    createdAt: '2025-07-19',
    updatedAt: '2025-07-19',
    config: { bmoAmount: '1L', bmoTiming: 'Immediate', web: 'No', gift: 'No' },
  },
  {
    id: 'p-009',
    code: 'crd0910',
    name: 'Shell Card Services',
    type: 'Internal',
    status: 'Active',
    logo: cardLogo,
    createdAt: '2025-06-27',
    updatedAt: '2025-06-27',
    config: { bmoAmount: 'No limit', bmoTiming: null, web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-010',
    code: 'delrew44',
    name: 'Deliveroo Partners',
    type: 'External',
    status: 'Pending Review',
    logo: null,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
    config: { bmoAmount: '3L', bmoTiming: 'Immediate', web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-011',
    code: 'amzlocker7',
    name: 'Amazon Locker Network',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-04-09',
    updatedAt: '2025-04-09',
    config: { bmoAmount: 'No limit', bmoTiming: null, web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-012',
    code: 'ops2201',
    name: 'Shell Loyalty Ops',
    type: 'Internal',
    status: 'Inactive',
    logo: opsLogo,
    createdAt: '2025-03-15',
    updatedAt: '2025-03-15',
    config: { bmoAmount: '10L', bmoTiming: 'Delayed', web: 'No', gift: 'No' },
  },
  {
    id: 'p-013',
    code: 'jeatrw18',
    name: 'Just Eat Rewards',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-12-04',
    updatedAt: '2025-12-04',
    config: { bmoAmount: '4L', bmoTiming: 'Immediate', web: 'Yes', gift: 'Yes' },
  },
  {
    id: 'p-014',
    code: 'whstravel2',
    name: 'WHSmith Travel',
    type: 'External',
    status: 'Suspended',
    logo: null,
    createdAt: '2025-02-23',
    updatedAt: '2025-02-23',
    config: { bmoAmount: '2L', bmoTiming: 'Delayed', web: 'No', gift: 'No' },
  },
  {
    id: 'p-015',
    code: 'bpxpromo',
    name: 'BP Cross-Promo',
    type: 'External',
    status: 'Pending Review',
    logo: null,
    createdAt: '2026-01-29',
    updatedAt: '2026-01-29',
    config: { bmoAmount: '1L', bmoTiming: 'Immediate', web: 'No', gift: 'No' },
  },
  {
    id: 'p-016',
    code: 'recharge6',
    name: 'Shell Recharge EV',
    type: 'Internal',
    status: 'Active',
    logo: null,
    createdAt: '2025-10-01',
    updatedAt: '2025-10-01',
    config: { bmoAmount: 'No limit', bmoTiming: null, web: 'Yes', gift: 'No' },
  },
  {
    id: 'p-017',
    code: 'subfuel19',
    name: 'Subway Fuel Stops',
    type: 'External',
    status: 'Active',
    logo: null,
    createdAt: '2025-11-20',
    updatedAt: '2025-11-20',
    config: { bmoAmount: '3L', bmoTiming: 'Immediate', web: 'Yes', gift: 'Yes' },
  },
  {
    id: 'p-018',
    code: 'krispyrw5',
    name: 'Krispy Kreme Rewards',
    type: 'External',
    status: 'Inactive',
    logo: null,
    createdAt: '2025-06-08',
    updatedAt: '2025-06-08',
    config: { bmoAmount: '2L', bmoTiming: 'Immediate', web: 'Yes', gift: 'No' },
  },
]
