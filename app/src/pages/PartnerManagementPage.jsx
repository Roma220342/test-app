import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import StatBar from '../components/list/StatBar'
import FilterToolbar from '../components/list/FilterToolbar'
import FilterChips from '../components/list/FilterChips'
import PartnerGrid from '../components/list/PartnerGrid'
import PartnerDetailPanel from '../components/detail/PartnerDetailPanel'
import PartnerForm from '../components/form/PartnerForm'
import DeleteConfirmModal from '../components/bulk/DeleteConfirmModal'
import Button from '../components/ui/Button'
import ScrollArea from '../components/ui/ScrollArea'
import { useToast } from '../components/ui/Toast'
import { initialPartners } from '../data/mockData'
import { bmoBucket } from '../utils/bmoFilter'
import { statusAction } from '../utils/statusAction'

const EMPTY_FILTERS = () => ({
  status: new Set(),
  type: new Set(),
  bmo: new Set(),
  timing: new Set(),
  web: new Set(),
  gift: new Set(),
})

const FILTER_KEYS = ['status', 'type', 'bmo', 'timing', 'web', 'gift']

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest first' },
  { value: 'createdAt-asc', label: 'Oldest first' },
  { value: 'updatedAt-desc', label: 'Recently updated' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'status', label: 'Status' },
]

const STATUS_ORDER = ['Active', 'Pending Review', 'Inactive', 'Suspended']

const todayISO = () => new Date().toISOString().slice(0, 10)

// Search/filter/sort state round-trips through the URL query string (no
// router needed) so a filtered view can be bookmarked or shared as a link,
// and survives a refresh instead of silently resetting.
function parseStateFromUrl(search) {
  const params = new URLSearchParams(search)
  const filters = EMPTY_FILTERS()
  FILTER_KEYS.forEach((key) => {
    const raw = params.get(key)
    if (raw) filters[key] = new Set(raw.split(','))
  })
  return {
    searchQuery: params.get('q') || '',
    filters,
    sortBy: params.get('sort') || 'createdAt-desc',
  }
}

function writeStateToUrl({ searchQuery, filters, sortBy }) {
  const params = new URLSearchParams()
  if (searchQuery) params.set('q', searchQuery)
  FILTER_KEYS.forEach((key) => {
    if (filters[key].size > 0) params.set(key, [...filters[key]].join(','))
  })
  if (sortBy && sortBy !== 'createdAt-desc') params.set('sort', sortBy)
  const query = params.toString()
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState(null, '', url)
}

function sortPartners(list, sortBy) {
  const sorted = [...list]
  switch (sortBy) {
    case 'createdAt-asc':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'updatedAt-desc':
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'status':
      return sorted.sort(
        (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
      )
    case 'createdAt-desc':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

function uniqueCopyCode(baseCode, existingCodes) {
  let candidate = `${baseCode}-copy`
  let n = 2
  while (existingCodes.has(candidate.toLowerCase())) {
    candidate = `${baseCode}-copy${n}`
    n += 1
  }
  return candidate
}

export default function PartnerManagementPage() {
  const addToast = useToast()

  const [partners, setPartners] = useState(initialPartners)
  const [isLoading, setIsLoading] = useState(true)

  const [urlState] = useState(() => parseStateFromUrl(window.location.search))
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery)
  const [filters, setFilters] = useState(urlState.filters)
  const [sortBy, setSortBy] = useState(urlState.sortBy)

  const [detailPartnerId, setDetailPartnerId] = useState(null)
  const [editingPartnerId, setEditingPartnerId] = useState(null)
  const [formState, setFormState] = useState(null) // create only — edit happens inline in the detail panel
  const [deleteRequest, setDeleteRequest] = useState(null) // { partners: [] }

  // Simulated initial fetch — demonstrates the loading state on first paint.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  // Keeps the current search/filters/sort bookmarkable and shareable, and
  // restores them on refresh instead of silently resetting to defaults.
  useEffect(() => {
    writeStateToUrl({ searchQuery, filters, sortBy })
  }, [searchQuery, filters, sortBy])

  const filteredPartners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    // Empty set for a group = no constraint; non-empty = OR within the group.
    // Groups themselves AND together.
    let list = partners.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
      const matchesStatus = filters.status.size === 0 || filters.status.has(p.status)
      const matchesType = filters.type.size === 0 || filters.type.has(p.type)
      const matchesBmo = filters.bmo.size === 0 || filters.bmo.has(bmoBucket(p.config.bmoAmount))
      const matchesTiming =
        filters.timing.size === 0 || (p.config.bmoTiming && filters.timing.has(p.config.bmoTiming))
      const matchesWeb = filters.web.size === 0 || filters.web.has(p.config.web)
      const matchesGift = filters.gift.size === 0 || filters.gift.has(p.config.gift)
      return (
        matchesQuery && matchesStatus && matchesType && matchesBmo && matchesTiming && matchesWeb && matchesGift
      )
    })
    return sortPartners(list, sortBy)
  }, [partners, searchQuery, filters, sortBy])

  const detailPartner = useMemo(
    () => partners.find((p) => p.id === detailPartnerId) || null,
    [partners, detailPartnerId]
  )

  const toggleFilterValue = (group, value) => {
    setFilters((prev) => {
      const next = new Set(prev[group])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [group]: next }
    })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters(EMPTY_FILTERS())
  }

  // Lets a stat card act as a one-click shortcut to "show me exactly this
  // segment" — replaces the whole filter set rather than adding to it, since
  // that's the more predictable reading of clicking a summary number.
  const applyStatFilter = (group, value) => {
    setSearchQuery('')
    setFilters(() => {
      const next = EMPTY_FILTERS()
      next[group] = new Set([value])
      return next
    })
  }

  // --- delete (single, from card menu or detail panel) ---
  const requestDelete = (partner) => setDeleteRequest({ partners: [partner] })

  const confirmDelete = () => {
    if (!deleteRequest) return
    const ids = new Set(deleteRequest.partners.map((p) => p.id))
    setPartners((prev) => prev.filter((p) => !ids.has(p.id)))
    addToast(`${deleteRequest.partners[0]?.name} deleted`)
    if (detailPartnerId && ids.has(detailPartnerId)) setDetailPartnerId(null)
    setDeleteRequest(null)
  }

  // --- card row actions ---
  const openDetail = (partner) => setDetailPartnerId(partner.id)
  const closeDetail = () => {
    setDetailPartnerId(null)
    setEditingPartnerId(null)
  }

  const openCreateForm = () => setFormState({ mode: 'create' })
  // Editing happens inside the detail panel — the panel stays put and its
  // content cross-fades, instead of a second drawer sliding in over it.
  const openEditForm = (partner) => {
    setDetailPartnerId(partner.id)
    setEditingPartnerId(partner.id)
  }
  const closeForm = () => setFormState(null)

  // Single source of truth for the Active/Inactive/Suspended/Pending Review
  // transition — shared by the card's "⋮" menu and the detail panel so the
  // two can never show different actions for the same status.
  const setPartnerStatus = (partnerId, status) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status, updatedAt: todayISO() } : p))
    )
  }

  const handleToggleActivate = (partner) => {
    const { next, label } = statusAction(partner.status)
    const previousStatus = partner.status
    setPartnerStatus(partner.id, next)
    // Deactivating a live partner can have real business impact (cuts off a
    // customer-facing integration), unlike Approve/Activate which only ever
    // turn something on — so only this direction gets an Undo safety net,
    // instead of a blocking confirm dialog that would add friction to every
    // status change including the safe ones.
    const isRisky = previousStatus === 'Active' && next === 'Inactive'
    addToast(`${partner.name} ${label.toLowerCase()}d`, {
      onUndo: isRisky ? () => setPartnerStatus(partner.id, previousStatus) : undefined,
    })
  }

  // Suspended isn't reachable via the Active/Inactive toggle above, and
  // routing it through the full edit form (open → scroll to Status → pick
  // → Save) is disproportionate friction for what should be a single click
  // — the same reasoning that gave Search Customer its own Suspend action.
  const handleSuspend = (partner) => {
    const previousStatus = partner.status
    setPartnerStatus(partner.id, 'Suspended')
    addToast(`${partner.name} suspended`, {
      onUndo: () => setPartnerStatus(partner.id, previousStatus),
    })
  }

  const handleDuplicate = (partner) => {
    const existingCodes = new Set(partners.map((p) => p.code.toLowerCase()))
    const newPartner = {
      ...partner,
      id: `p-${Date.now()}`,
      name: `${partner.name} (Copy)`,
      code: uniqueCopyCode(partner.code, existingCodes),
      status: 'Pending Review',
      logo: null,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    }
    setPartners((prev) => [newPartner, ...prev])
    // Opens the copy for review immediately instead of leaving the user to
    // hunt for it in the grid — duplicating is almost always followed by
    // "now tweak the name/code/config", so skip straight to that step.
    setDetailPartnerId(newPartner.id)
    setEditingPartnerId(newPartner.id)
  }

  const handleFormSubmit = (data) => {
    const newPartner = {
      id: `p-${Date.now()}`,
      createdAt: todayISO(),
      updatedAt: todayISO(),
      logo: null,
      ...data,
    }
    setPartners((prev) => [newPartner, ...prev])
    addToast(`${data.name} created`)
    setFormState(null)
  }

  const handleEditSave = (partnerId, data) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, ...data, updatedAt: todayISO() } : p))
    )
    addToast(`${data.name} updated`)
    setEditingPartnerId(null)
  }

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        <header className="sticky top-0 z-10 flex shrink-0 flex-col gap-4 border-b border-border bg-surface px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">Partner Management</h1>
            <p className="mt-1 text-xs font-normal text-ink-faint">
              Manage third-party integrations and internal brand loyalty accounts
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={openCreateForm}>
            <Plus size={18} />
            New Partner
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1" innerClassName="px-6 py-6">
          <div className="mx-auto max-w-[1600px] space-y-5 pb-2">
            <StatBar partners={partners} onFilterSelect={applyStatFilter} />

            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={SORT_OPTIONS}
              filters={filters}
              onToggleFilterValue={toggleFilterValue}
              onClearAllFilters={clearAllFilters}
            />

            <FilterChips
              searchQuery={searchQuery}
              filters={filters}
              onClearSearch={() => setSearchQuery('')}
              onToggleFilterValue={toggleFilterValue}
              onClearAll={clearAllFilters}
            />

            <PartnerGrid
              partners={filteredPartners}
              isLoading={isLoading}
              hasAnyPartners={partners.length > 0}
              onOpenDetail={openDetail}
              onEdit={openEditForm}
              onDuplicate={handleDuplicate}
              onToggleActivate={handleToggleActivate}
              onSuspend={handleSuspend}
              onRequestDelete={requestDelete}
              onClearFilters={clearAllFilters}
              onOpenCreate={openCreateForm}
            />
          </div>
        </ScrollArea>
      </main>

      <PartnerDetailPanel
        open={!!detailPartner}
        partner={detailPartner}
        onClose={closeDetail}
        onEdit={openEditForm}
        onDuplicate={handleDuplicate}
        onToggleActivate={handleToggleActivate}
        onSuspend={handleSuspend}
        onRequestDelete={requestDelete}
        existingPartners={partners}
        isEditing={!!detailPartner && editingPartnerId === detailPartner.id}
        onCancelEdit={() => setEditingPartnerId(null)}
        onSubmitEdit={handleEditSave}
      />

      <PartnerForm
        open={!!formState}
        existingPartners={partners}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        open={!!deleteRequest}
        count={deleteRequest?.partners?.length || 0}
        names={deleteRequest?.partners?.map((p) => p.name) || []}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRequest(null)}
      />
    </>
  )
}
