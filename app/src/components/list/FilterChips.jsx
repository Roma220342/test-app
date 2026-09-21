import { X } from 'lucide-react'

const DEFAULT_GROUP_LABELS = {
  status: 'Status',
  type: 'Type',
  bmo: 'BMO',
  timing: 'BMO Timing',
  web: 'Web',
  gift: 'Gift',
}

function Chip({ children, onClear }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-surface-sunken px-3 py-1 text-xs text-ink-soft">
      {children}
      <button
        type="button"
        onClick={onClear}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-lg text-ink-faint hover:text-ink-soft"
        aria-label="Remove filter"
      >
        <X size={12} />
      </button>
    </span>
  )
}

export default function FilterChips({
  searchQuery,
  filters,
  onClearSearch,
  onToggleFilterValue,
  onClearAll,
  groupLabels = DEFAULT_GROUP_LABELS,
}) {
  const chips = []

  if (searchQuery) {
    chips.push({ key: 'search', label: `Search: "${searchQuery}"`, onClear: onClearSearch })
  }

  Object.entries(filters).forEach(([group, values]) => {
    values.forEach((value) => {
      chips.push({
        key: `${group}:${value}`,
        label: `${groupLabels[group]}: ${value}`,
        onClear: () => onToggleFilterValue(group, value),
      })
    })
  })

  if (chips.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip key={chip.key} onClear={chip.onClear}>
          {chip.label}
        </Chip>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-ink-soft hover:text-ink"
      >
        Clear all
      </button>
    </div>
  )
}
