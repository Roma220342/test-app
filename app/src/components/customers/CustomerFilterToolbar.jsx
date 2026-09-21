import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, Check } from 'lucide-react'
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '../../data/mockCustomers'

const FILTER_GROUPS = [
  { key: 'status', label: 'Status', options: CUSTOMER_STATUSES },
  { key: 'tier', label: 'Tier', options: CUSTOMER_TIERS },
]

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-1 ${
          checked ? 'border-ink bg-ink' : 'border-border bg-surface hover:border-border-hover'
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </label>
  )
}

function FilterPopover({ filters, onToggleValue, onClearAll }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const activeCount = Object.values(filters).reduce((sum, set) => sum + set.size, 0)

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex h-10 items-center gap-2 rounded-lg border bg-surface px-4 text-sm font-medium text-ink transition-colors duration-200 [&>svg:first-child]:-ml-1 ${
          open ? 'border-ink' : 'border-border hover:border-border-hover'
        }`}
      >
        <SlidersHorizontal size={16} className="text-ink-faint" />
        Filter
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filters"
          className="no-native-scrollbar absolute right-0 top-[calc(100%+8px)] z-20 max-h-[26rem] w-64 overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Filters</h3>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-ink-soft hover:text-ink"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-3 divide-y divide-border">
            {FILTER_GROUPS.map((group) => (
              <div key={group.key} className="py-3 first:pt-0 last:pb-0">
                <p className="mb-1 text-xs font-medium tracking-wide text-ink-faint">
                  {group.label}
                </p>
                <div>
                  {group.options.map((option) => (
                    <FilterCheckbox
                      key={option}
                      label={option}
                      checked={filters[group.key].has(option)}
                      onChange={() => onToggleValue(group.key, option)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CustomerFilterToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onToggleFilterValue,
  onClearAllFilters,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-[360px] shrink-0">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone, email, or card…"
          autoFocus
          className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm font-medium text-ink placeholder:text-ink-faint transition-colors duration-200 hover:border-border-hover focus:border-ink focus:outline-none"
        />
      </div>

      <FilterPopover filters={filters} onToggleValue={onToggleFilterValue} onClearAll={onClearAllFilters} />
    </div>
  )
}
