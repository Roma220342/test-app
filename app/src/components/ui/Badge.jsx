const STATUS_STYLE = {
  Active: { bg: 'var(--status-active-soft)', fg: 'var(--status-active)' },
  Inactive: { bg: 'var(--status-inactive-soft)', fg: 'var(--status-inactive)' },
  'Pending Review': { bg: 'var(--status-pending-soft)', fg: 'var(--status-pending)' },
  Suspended: { bg: 'var(--status-suspended-soft)', fg: 'var(--status-suspended)' },
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Inactive
  return (
    <span
      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {status}
    </span>
  )
}

// Type is identifying metadata, not a status — kept deliberately neutral
// (gray, not tinted) so it doesn't compete for attention with the badges
// that actually signal something needs a look (status).
export function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">
      {type}
    </span>
  )
}
