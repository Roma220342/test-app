import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { StatusBadge } from '../ui/Badge'
import SkeletonRow from '../ui/SkeletonRow'
import EmptyState from '../list/EmptyState'
import ScrollArea from '../ui/ScrollArea'
import CustomerActionsMenu from './CustomerActionsMenu'

const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' }
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', dateFormat)

// Fixed column widths (via <colgroup>, paired with table-fixed) so sorting
// or filtering — which changes cell content lengths — never reflows the
// table. One arrow icon that rotates for asc/desc, instead of swapping
// between different icon glyphs, keeps the header pixel-stable too.
const COLUMN_WIDTHS = ['24%', '28%', '13%', '11%', '17%', '7%']

function SortableHeader({ label, sortKey, sort, onSort }) {
  const isActive = sort.key === sortKey
  const pointsUp = isActive && sort.direction === 'asc'

  return (
    <th className="px-4 py-2.5 text-xs font-medium tracking-wide text-ink-faint">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        title={`Sort by ${label}`}
        className="inline-flex items-center gap-1 transition-colors hover:text-ink-soft"
      >
        {label}
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-150 ${pointsUp ? 'rotate-180' : ''} ${
            isActive ? 'text-ink-soft' : 'text-ink-faint/50'
          }`}
        />
      </button>
    </th>
  )
}

export default function CustomerResultsTable({
  phase,
  customers,
  sort,
  onSort,
  onOpenDetail,
  actionHandlers,
}) {
  if (phase === 'empty') return <EmptyState variant="no-customers-found" />

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <ScrollArea className="min-h-0 flex-1">
        <table className="w-full table-fixed text-left">
          <colgroup>
            {COLUMN_WIDTHS.map((width, i) => (
              <col key={i} style={{ width }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-surface-sunken">
              <SortableHeader label="Customer" sortKey="name" sort={sort} onSort={onSort} />
              <th className="px-4 py-2.5 text-xs font-medium tracking-wide text-ink-faint">Contact</th>
              <SortableHeader label="Status" sortKey="status" sort={sort} onSort={onSort} />
              <SortableHeader label="Tier" sortKey="tier" sort={sort} onSort={onSort} />
              <SortableHeader label="Last Activity" sortKey="lastActivity" sort={sort} onSort={onSort} />
              <th className="px-4 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {phase === 'loading'
              ? Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)
              : customers.map((customer) => (
                  <tr
                    key={customer.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenDetail(customer)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onOpenDetail(customer)
                    }}
                    className="cursor-pointer border-b border-border bg-surface transition-colors last:border-b-0 hover:bg-[#FFFCFC] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} size="sm" />
                        <span className="truncate text-sm font-medium text-ink">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate text-sm text-ink-soft">{customer.phone}</div>
                      <div className="truncate text-xs text-ink-faint">{customer.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="truncate px-4 py-3 text-sm text-ink-soft">{customer.tier}</td>
                    <td className="truncate px-4 py-3 text-sm text-ink-soft">
                      {formatDate(customer.lastActivityAt)}
                    </td>
                    <td className="px-4 py-3">
                      <CustomerActionsMenu customer={customer} {...actionHandlers} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
