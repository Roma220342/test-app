import { useEffect, useMemo, useState } from 'react'
import { Plus, UserMinus } from 'lucide-react'
import CustomerFilterToolbar from '../components/customers/CustomerFilterToolbar'
import CustomerResultsTable from '../components/customers/CustomerResultsTable'
import CustomerDetailPanel from '../components/customers/CustomerDetailPanel'
import CustomerForm from '../components/customers/CustomerForm'
import AdjustPointsModal from '../components/customers/AdjustPointsModal'
import AssignOfferModal from '../components/customers/AssignOfferModal'
import SuspendCustomerModal from '../components/customers/SuspendCustomerModal'
import DeleteConfirmModal from '../components/bulk/DeleteConfirmModal'
import FilterChips from '../components/list/FilterChips'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toast'
import { initialCustomers } from '../data/mockCustomers'
import { customerStatusAction } from '../utils/customerStatusAction'

const GROUP_LABELS = { status: 'Status', tier: 'Tier' }

const normalize = (s) => s.toLowerCase().replace(/[\s-]/g, '')

const PAGE_SIZE = 8
const STATUS_ORDER = ['Active', 'Suspended', 'Inactive']
const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Platinum']

// The signed-in agent shown in the sidebar — every audit entry is attributed
// to whoever performed the action, which is the point of the log.
const CURRENT_ACTOR = 'Alex Danvers'

const EMPTY_FILTERS = () => ({ status: new Set(), tier: new Set() })

const todayISO = () => new Date().toISOString().slice(0, 10)

function logEntry(action, detail) {
  return {
    id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: todayISO(),
    actor: CURRENT_ACTOR,
    action,
    detail,
  }
}

function compareByKey(a, b, key) {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'status':
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    case 'tier':
      return TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
    case 'lastActivity':
    default:
      return a.lastActivityAt.localeCompare(b.lastActivityAt)
  }
}

function sortCustomers(list, sort) {
  const sorted = [...list].sort((a, b) => compareByKey(a, b, sort.key))
  return sort.direction === 'desc' ? sorted.reverse() : sorted
}

export default function SearchCustomerPage() {
  const addToast = useToast()

  const [customers, setCustomers] = useState(initialCustomers)
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS())
  const [sort, setSort] = useState({ key: 'lastActivity', direction: 'desc' })
  const [page, setPage] = useState(1)

  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [formState, setFormState] = useState(null) // create only — edit happens inline in the detail panel
  const [pointsTarget, setPointsTarget] = useState(null)
  const [offerTarget, setOfferTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [anonymizeTarget, setAnonymizeTarget] = useState(null)
  const [suspendTarget, setSuspendTarget] = useState(null)

  // Simulated initial fetch — demonstrates the loading state on first paint,
  // same as Partner Management.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  // A narrower/reordered result set can leave the user stranded on a
  // now-nonexistent page, so any change to what's shown resets to page 1.
  const handleQueryChange = (value) => {
    setQuery(value)
    setPage(1)
  }

  const toggleFilterValue = (group, value) => {
    setFilters((prev) => {
      const next = new Set(prev[group])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [group]: next }
    })
    setPage(1)
  }

  const clearAllFilters = () => {
    setQuery('')
    setFilters(EMPTY_FILTERS())
    setPage(1)
  }

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      return { key, direction: key === 'lastActivity' ? 'desc' : 'asc' }
    })
    setPage(1)
  }

  // Single funnel for every mutation: applies the change and records who did
  // what, so the audit log can never drift from the data it describes.
  // Deliberately does NOT touch lastActivityAt — that column means "when the
  // customer was last active", and staff touching the account is not the
  // customer being active. It is also the default sort, so writing to it here
  // would make rows jump under the agent after every action.
  const updateCustomer = (id, changes, entry) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...changes,
              activityLog: entry ? [...(c.activityLog || []), entry] : c.activityLog,
            }
          : c
      )
    )
  }

  const handleFormSubmit = (data) => {
    const newCustomer = {
      id: `c-${Date.now()}`,
      ...data,
      pointsBalance: 0,
      memberSince: todayISO(),
      lastActivityAt: todayISO(),
      transactions: [],
      offers: [],
      activityLog: [logEntry('Account created', 'Enrolled manually by staff')],
    }
    setCustomers((prev) => [newCustomer, ...prev])
    addToast(`${data.name} created`)
    setFormState(null)
  }

  // Edit happens inline in the detail panel — no separate drawer swap.
  const handleEditSave = (customerId, data) => {
    updateCustomer(customerId, data, logEntry('Profile updated', 'Contact details edited'))
    addToast(`${data.name} updated`)
    setEditingCustomerId(null)
  }

  const handleAdjustPoints = ({ delta, reason }) => {
    const customer = pointsTarget
    const sign = delta > 0 ? '+' : ''
    // The adjustment also lands in the transaction history — otherwise the
    // balance silently changes and the next agent on the next call has no way
    // to explain where the points came from.
    const adjustment = {
      id: `t-adj-${Date.now()}`,
      date: todayISO(),
      site: `Customer service · ${CURRENT_ACTOR}`,
      description: `Manual adjustment — ${reason}`,
      amount: null,
      pointsDelta: delta,
    }
    updateCustomer(
      customer.id,
      {
        pointsBalance: customer.pointsBalance + delta,
        transactions: [adjustment, ...customer.transactions],
      },
      logEntry('Points adjusted', `${sign}${delta} pts — ${reason}`)
    )
    addToast(`${sign}${delta} pts applied to ${customer.name}`)
    setPointsTarget(null)
  }

  const handleAssignOffer = ({ name }) => {
    const customer = offerTarget
    const offer = {
      id: `o-${Date.now()}`,
      name,
      status: 'Active',
      validUntil: `${new Date().getFullYear() + 1}-01-31`,
    }
    updateCustomer(
      customer.id,
      { offers: [...customer.offers, offer] },
      logEntry('Offer assigned', name)
    )
    addToast(`"${name}" assigned to ${customer.name}`)
    setOfferTarget(null)
  }

  // Suspending asks for a reason first — "why isn't my card working?" is the
  // call this screen exists to answer, so the reason has to be captured at
  // the moment it's known and shown on the account afterwards.
  const handleToggleStatus = (customer) => {
    if (customerStatusAction(customer.status).next === 'Suspended') {
      setSuspendTarget(customer)
      return
    }
    updateCustomer(
      customer.id,
      { status: 'Active', statusNote: null },
      logEntry('Account reactivated', `Changed from ${customer.status}`)
    )
    addToast(`${customer.name} reactivated`)
  }

  const confirmSuspend = ({ reason }) => {
    const customer = suspendTarget
    updateCustomer(
      customer.id,
      { status: 'Suspended', statusNote: reason },
      logEntry('Account suspended', reason)
    )
    addToast(`${customer.name} suspended`, {
      onUndo: () =>
        updateCustomer(
          customer.id,
          { status: customer.status, statusNote: customer.statusNote || null },
          logEntry('Suspension reverted', 'Undone by agent')
        ),
    })
    setSuspendTarget(null)
  }

  const confirmAnonymize = () => {
    const customer = anonymizeTarget
    // Keeps transactions and balance — the financial record must survive a
    // GDPR erasure — and scrubs only the personally identifying fields.
    updateCustomer(
      customer.id,
      {
        name: 'Anonymized member',
        email: 'anonymized@removed.invalid',
        phone: '—',
        loyaltyCard: '•••• •••• ••••',
        status: 'Inactive',
        statusNote: 'Personal data erased at the customer’s request',
        // Marks the erasure as terminal: the actions menu drops everything
        // that would write personal data back onto the record.
        anonymizedAt: todayISO(),
      },
      logEntry('Account anonymized', 'Personal data erased on request (GDPR)')
    )
    addToast(`${customer.name} anonymized`)
    setAnonymizeTarget(null)
  }

  const confirmDelete = () => {
    const customer = deleteTarget
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
    if (selectedCustomerId === customer.id) setSelectedCustomerId(null)
    addToast(`${customer.name} deleted`)
    setDeleteTarget(null)
  }

  const actionHandlers = {
    onEdit: (customer) => {
      setSelectedCustomerId(customer.id)
      setEditingCustomerId(customer.id)
    },
    onAdjustPoints: setPointsTarget,
    onAssignOffer: setOfferTarget,
    onToggleStatus: handleToggleStatus,
    onRequestAnonymize: setAnonymizeTarget,
    onRequestDelete: setDeleteTarget,
  }

  const matches = useMemo(() => {
    const trimmed = query.trim()
    const needle = trimmed ? normalize(trimmed) : null
    const filtered = customers.filter((c) => {
      const matchesQuery =
        !needle || [c.name, c.email, c.phone, c.loyaltyCard].some((field) => normalize(field).includes(needle))
      const matchesStatus = filters.status.size === 0 || filters.status.has(c.status)
      const matchesTier = filters.tier.size === 0 || filters.tier.has(c.tier)
      return matchesQuery && matchesStatus && matchesTier
    })
    return sortCustomers(filtered, sort)
  }, [customers, query, filters, sort])

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedMatches = matches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const phase = isLoading ? 'loading' : matches.length === 0 ? 'empty' : 'results'

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  )

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Search Customer</h1>
          <p className="mt-1 text-xs font-normal text-ink-faint">
            Find a customer to view their profile, transactions, and offers
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setFormState({ mode: 'create' })}>
          <Plus size={18} />
          New Customer
        </Button>
      </header>

      <div className="shrink-0 px-6 py-4">
        <CustomerFilterToolbar
          searchQuery={query}
          onSearchChange={handleQueryChange}
          filters={filters}
          onToggleFilterValue={toggleFilterValue}
          onClearAllFilters={clearAllFilters}
        />

        <FilterChips
          searchQuery={query}
          filters={filters}
          onClearSearch={() => handleQueryChange('')}
          onToggleFilterValue={toggleFilterValue}
          onClearAll={clearAllFilters}
          groupLabels={GROUP_LABELS}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-6 pb-6">
        <CustomerResultsTable
          phase={phase}
          customers={pagedMatches}
          sort={sort}
          onSort={handleSort}
          onOpenDetail={(customer) => setSelectedCustomerId(customer.id)}
          actionHandlers={actionHandlers}
        />

        {phase === 'results' && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            totalCount={matches.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      <CustomerDetailPanel
        open={!!selectedCustomer}
        customer={selectedCustomer}
        onClose={() => {
          setSelectedCustomerId(null)
          setEditingCustomerId(null)
        }}
        actionHandlers={actionHandlers}
        existingCustomers={customers}
        isEditing={!!selectedCustomer && editingCustomerId === selectedCustomer.id}
        onCancelEdit={() => setEditingCustomerId(null)}
        onSubmitEdit={handleEditSave}
      />

      <CustomerForm
        open={!!formState}
        mode="create"
        existingCustomers={customers}
        onClose={() => setFormState(null)}
        onSubmit={handleFormSubmit}
      />

      <AdjustPointsModal
        open={!!pointsTarget}
        customer={pointsTarget}
        onClose={() => setPointsTarget(null)}
        onConfirm={handleAdjustPoints}
      />

      <AssignOfferModal
        open={!!offerTarget}
        customer={offerTarget}
        onClose={() => setOfferTarget(null)}
        onConfirm={handleAssignOffer}
      />

      <SuspendCustomerModal
        open={!!suspendTarget}
        customer={suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={confirmSuspend}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        count={1}
        names={deleteTarget ? [deleteTarget.name] : []}
        title="Delete this customer?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" and their entire history will be permanently removed. This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <DeleteConfirmModal
        open={!!anonymizeTarget}
        count={1}
        names={anonymizeTarget ? [anonymizeTarget.name] : []}
        title="Anonymize this customer?"
        description={
          anonymizeTarget
            ? `Personal details for "${anonymizeTarget.name}" will be erased. Transactions and points balance are kept for financial records. This can't be undone.`
            : ''
        }
        confirmLabel="Anonymize"
        confirmIcon={UserMinus}
        onConfirm={confirmAnonymize}
        onCancel={() => setAnonymizeTarget(null)}
      />
    </main>
  )
}
