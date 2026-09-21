// Fully mocked customer data — no backend, no persistence.
// transaction.site pulls names from the existing partner dataset so both
// pages' mock worlds read as one product instead of two disconnected demos.

import { initialPartners } from './mockData'

const SITES = initialPartners.map((p) => p.name)
const site = (i) => SITES[i % SITES.length]

export const CUSTOMER_STATUSES = ['Active', 'Inactive', 'Suspended']
export const CUSTOMER_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum']

export const AVAILABLE_OFFERS = [
  'Double Points Weekend',
  'Free Coffee with Fuel',
  '10% Off Fleet Card Spend',
  'Refer a Friend Bonus',
  'Birthday Reward',
  'EV Recharge Discount',
  'Goodwill Car Wash Voucher',
]

function buildActivityLog(seed) {
  return [
    {
      id: `a-${seed}-1`,
      at: `2026-0${1 + (seed % 8)}-1${seed % 9}`,
      actor: 'System',
      action: 'Account created',
      detail: 'Enrolled via mobile app',
    },
    {
      id: `a-${seed}-2`,
      at: `2026-0${2 + (seed % 7)}-2${seed % 8}`,
      actor: 'Maya Fitzgerald',
      action: 'Tier changed',
      detail: 'Upgraded after reaching spend threshold',
    },
  ]
}

function buildTransactions(seed, count) {
  return Array.from({ length: count }, (_, i) => {
    const day = 27 - ((seed + i * 3) % 27)
    const month = 1 + ((seed + i) % 9)
    const isRedeem = (seed + i) % 4 === 0
    return {
      id: `t-${seed}-${i}`,
      date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      site: site(seed + i),
      description: isRedeem ? 'Points redeemed' : 'Purchase',
      amount: isRedeem ? null : `£${(6 + ((seed + i * 7) % 40)).toFixed(2)}`,
      pointsDelta: isRedeem ? -(50 + ((seed + i) % 5) * 50) : 10 + ((seed + i) % 6) * 5,
    }
  })
}

function buildOffers(seed, count) {
  const names = [
    'Double Points Weekend',
    'Free Coffee with Fuel',
    '10% Off Fleet Card Spend',
    'Refer a Friend Bonus',
    'Birthday Reward',
    'EV Recharge Discount',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: `o-${seed}-${i}`,
    name: names[(seed + i) % names.length],
    status: ['Active', 'Expired', 'Used'][(seed + i) % 3],
    validUntil: `2026-${String(1 + ((seed + i * 2) % 9)).padStart(2, '0')}-${String(
      5 + ((seed + i) % 20)
    ).padStart(2, '0')}`,
  }))
}

const CUSTOMERS = [
  {
    id: 'c-001',
    name: 'Emma Whitfield',
    email: 'emma.whitfield@mail.com',
    phone: '+44 7700 900123',
    loyaltyCard: '4000 1122 3344',
    status: 'Active',
    tier: 'Platinum',
    pointsBalance: 18420,
    memberSince: '2021-03-14',
    lastActivityAt: '2026-09-18',
    transactions: buildTransactions(1, 26),
    offers: buildOffers(1, 3),
  },
  {
    id: 'c-002',
    name: 'Liam Osei',
    email: 'liam.osei@mail.com',
    phone: '+44 7700 900456',
    loyaltyCard: '4000 2233 4455',
    status: 'Active',
    tier: 'Gold',
    pointsBalance: 7210,
    memberSince: '2022-07-02',
    lastActivityAt: '2026-09-15',
    transactions: buildTransactions(2, 12),
    offers: buildOffers(2, 2),
  },
  {
    id: 'c-003',
    name: 'Sofia Marchetti',
    email: 'sofia.marchetti@mail.com',
    phone: '+44 7700 900789',
    loyaltyCard: '4000 3344 5566',
    status: 'Suspended',
    tier: 'Silver',
    pointsBalance: 1340,
    memberSince: '2023-11-20',
    lastActivityAt: '2026-06-02',
    transactions: buildTransactions(3, 5),
    offers: [],
  },
  {
    id: 'c-004',
    name: 'Noah Fischer',
    email: 'noah.fischer@mail.com',
    phone: '+44 7700 900321',
    loyaltyCard: '4000 4455 6677',
    status: 'Active',
    tier: 'Bronze',
    pointsBalance: 210,
    memberSince: '2026-08-01',
    lastActivityAt: '2026-08-01',
    transactions: [],
    offers: buildOffers(4, 1),
  },
  {
    id: 'c-005',
    name: 'Aiko Tanaka',
    email: 'aiko.tanaka@mail.com',
    phone: '+44 7700 900654',
    loyaltyCard: '4000 5566 7788',
    status: 'Active',
    tier: 'Gold',
    pointsBalance: 9840,
    memberSince: '2020-05-09',
    lastActivityAt: '2026-09-20',
    transactions: buildTransactions(5, 31),
    offers: buildOffers(5, 4),
  },
  {
    id: 'c-006',
    name: 'Daniel Petrov',
    email: 'daniel.petrov@mail.com',
    phone: '+44 7700 900987',
    loyaltyCard: '4000 6677 8899',
    status: 'Inactive',
    tier: 'Bronze',
    pointsBalance: 60,
    memberSince: '2024-01-17',
    lastActivityAt: '2025-02-11',
    transactions: buildTransactions(6, 3),
    offers: [],
  },
  {
    id: 'c-007',
    name: 'Grace Okafor',
    email: 'grace.okafor@mail.com',
    phone: '+44 7700 900135',
    loyaltyCard: '4000 7788 9900',
    status: 'Active',
    tier: 'Platinum',
    pointsBalance: 24310,
    memberSince: '2019-09-23',
    lastActivityAt: '2026-09-19',
    transactions: buildTransactions(7, 40),
    offers: buildOffers(7, 5),
  },
  {
    id: 'c-008',
    name: 'Mateusz Kowalski',
    email: 'mateusz.kowalski@mail.com',
    phone: '+44 7700 900246',
    loyaltyCard: '4000 8899 0011',
    status: 'Active',
    tier: 'Silver',
    pointsBalance: 3080,
    memberSince: '2023-02-28',
    lastActivityAt: '2026-09-10',
    transactions: buildTransactions(8, 9),
    offers: buildOffers(8, 1),
  },
  {
    id: 'c-009',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@mail.com',
    phone: '+44 7700 900369',
    loyaltyCard: '4000 9900 1122',
    status: 'Suspended',
    tier: 'Gold',
    pointsBalance: 5420,
    memberSince: '2021-12-05',
    lastActivityAt: '2026-04-30',
    transactions: buildTransactions(9, 15),
    offers: buildOffers(9, 2),
  },
  {
    id: 'c-010',
    name: 'Ravi Chandran',
    email: 'ravi.chandran@mail.com',
    phone: '+44 7700 900482',
    loyaltyCard: '4000 0011 2233',
    status: 'Active',
    tier: 'Bronze',
    pointsBalance: 890,
    memberSince: '2025-06-19',
    lastActivityAt: '2026-09-05',
    transactions: buildTransactions(10, 6),
    offers: [],
  },
  {
    id: 'c-011',
    name: 'Freya Nilsson',
    email: 'freya.nilsson@mail.com',
    phone: '+44 7700 900579',
    loyaltyCard: '4000 1234 5678',
    status: 'Active',
    tier: 'Gold',
    pointsBalance: 6650,
    memberSince: '2022-04-11',
    lastActivityAt: '2026-09-17',
    transactions: buildTransactions(11, 18),
    offers: buildOffers(11, 3),
  },
  {
    id: 'c-012',
    name: 'Tomás Herrera',
    email: 'tomas.herrera@mail.com',
    phone: '+44 7700 900692',
    loyaltyCard: '4000 2345 6789',
    status: 'Inactive',
    tier: 'Silver',
    pointsBalance: 1980,
    memberSince: '2023-08-08',
    lastActivityAt: '2025-11-22',
    transactions: buildTransactions(12, 7),
    offers: [],
  },
  {
    id: 'c-013',
    name: 'Isabel Duarte',
    email: 'isabel.duarte@mail.com',
    phone: '+44 7700 900718',
    loyaltyCard: '4000 3456 7890',
    status: 'Active',
    tier: 'Platinum',
    pointsBalance: 15990,
    memberSince: '2020-10-30',
    lastActivityAt: '2026-09-14',
    transactions: buildTransactions(13, 24),
    offers: buildOffers(13, 3),
  },
  {
    id: 'c-014',
    name: 'Jack Dunmore',
    email: 'jack.dunmore@mail.com',
    phone: '+44 7700 900825',
    loyaltyCard: '4000 4567 8901',
    status: 'Active',
    tier: 'Bronze',
    pointsBalance: 340,
    memberSince: '2026-05-02',
    lastActivityAt: '2026-08-29',
    transactions: buildTransactions(14, 4),
    offers: buildOffers(14, 1),
  },
  {
    id: 'c-015',
    name: 'Nadia Volkov',
    email: 'nadia.volkov@mail.com',
    phone: '+44 7700 900931',
    loyaltyCard: '4000 5678 9012',
    status: 'Active',
    tier: 'Gold',
    pointsBalance: 8720,
    memberSince: '2021-06-25',
    lastActivityAt: '2026-09-12',
    transactions: buildTransactions(15, 21),
    offers: buildOffers(15, 2),
  },
]

export const initialCustomers = CUSTOMERS.map((customer, i) => ({
  ...customer,
  activityLog: buildActivityLog(i + 1),
}))
