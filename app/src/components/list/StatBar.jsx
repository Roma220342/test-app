import { Users, Globe, Building2, CheckCircle2 } from 'lucide-react'

function latestMonthCount(partners) {
  if (partners.length === 0) return 0
  const months = partners.map((p) => p.createdAt.slice(0, 7)) // 'YYYY-MM'
  const latest = months.reduce((a, b) => (b > a ? b : a))
  return months.filter((m) => m === latest).length
}

function pct(part, total) {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

// Plain colored text, no pill/background — matches the reference's
// "+10% / -9% vs last 30 days" delta style. Green/red carry real meaning
// (trend direction); the neutral gray variant is for a plain share-of-total
// that isn't inherently good or bad.
function Delta({ tone = 'neutral', children, onClick }) {
  const toneClass =
    tone === 'positive'
      ? 'text-status-active'
      : tone === 'negative'
        ? 'text-status-suspended'
        : tone === 'warning'
          ? 'text-status-pending'
          : 'text-ink-soft'
  const shared = `shrink-0 text-xs font-semibold ${toneClass}`
  if (!onClick) return <span className={shared}>{children}</span>
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`${shared} hover:underline`}
    >
      {children}
    </button>
  )
}

// Static summary tile — not a filter shortcut. The "N in review" delta below
// is its own small link where a stat genuinely doubles as a shortcut; the
// card itself is just a number.
//
// Nested gray-outer/white-inner structure, per reference: the card itself is
// a light-gray tile (label + icon live directly on it), and the number +
// delta sit inside a smaller white tile nested within.
function StatCard({ label, value, icon: Icon, delta, caption }) {
  // Manrope Bold's "1" carries more left-side-bearing than other digits, so
  // it visually reads as indented compared to the label above it — nudge
  // only kicks in for that glyph instead of shifting every value left.
  const startsWithOne = String(value).startsWith('1')

  return (
    <div className="rounded-xl border border-transparent bg-surface-sunken p-1 text-left">
      <div className="flex items-center justify-between px-4 pt-1">
        <span className="text-sm font-medium text-ink-faint">{label}</span>
        <Icon size={16} className="text-ink-faint" />
      </div>

      <div className="mt-2 rounded-lg bg-surface p-4">
        <div
          className={`w-fit text-2xl font-bold tracking-tight text-ink tabular-nums ${startsWithOne ? '-ml-[3px]' : ''}`}
        >
          {value}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {delta}
          <span className="truncate text-ink-faint">{caption}</span>
        </div>
      </div>
    </div>
  )
}

// Every number and delta below is computed from the real partner list —
// nothing here is decorative filler.
export default function StatBar({ partners, onFilterSelect }) {
  const total = partners.length
  const external = partners.filter((p) => p.type === 'External').length
  const internal = partners.filter((p) => p.type === 'Internal').length
  const active = partners.filter((p) => p.status === 'Active').length
  const pending = partners.filter((p) => p.status === 'Pending Review').length
  const newestMonthCount = latestMonthCount(partners)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Partners"
        value={total}
        icon={Users}
        delta={<Delta tone="positive">+{newestMonthCount}</Delta>}
        caption="this month"
      />
      <StatCard
        label="External Partners"
        value={external}
        icon={Globe}
        delta={<Delta>{pct(external, total)}%</Delta>}
        caption="of all partners"
      />
      <StatCard
        label="Internal Partners"
        value={internal}
        icon={Building2}
        delta={<Delta>{pct(internal, total)}%</Delta>}
        caption="of all partners"
      />
      <StatCard
        label="Active Status"
        value={active}
        icon={CheckCircle2}
        delta={
          <Delta tone="warning" onClick={() => onFilterSelect('status', 'Pending Review')}>
            {pending} in review
          </Delta>
        }
        caption="currently live"
      />
    </div>
  )
}
