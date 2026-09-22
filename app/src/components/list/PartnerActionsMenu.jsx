import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Pencil, Copy, Ban, Trash2 } from 'lucide-react'
import { statusAction } from '../../utils/statusAction'

// Single source of truth for "what can I do with this partner" — used by
// both the card's kebab and the detail panel's header, so the two can never
// offer a different set of actions for the same record.
export default function PartnerActionsMenu({
  partner,
  onEdit,
  onDuplicate,
  onToggleActivate,
  onSuspend,
  onRequestDelete,
  align = 'right',
  // The detail panel already has the status toggle as its own primary
  // footer button, so it hides this menu item to avoid offering the same
  // action twice in one view. The card has no such button, so it keeps it.
  showStatusAction = true,
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
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

  function runAction(e, action) {
    e.stopPropagation()
    setOpen(false)
    action(partner)
  }

  const { label: statusLabel, icon: StatusIcon } = statusAction(partner.status)

  return (
    <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink-soft"
        aria-label="Open partner actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-9 z-20 w-44 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-sm`}
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => runAction(e, onEdit)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink [&>svg:first-child]:-ml-1 hover:bg-surface-hover"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => runAction(e, onDuplicate)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink [&>svg:first-child]:-ml-1 hover:bg-surface-hover"
          >
            <Copy size={14} />
            Duplicate
          </button>
          {showStatusAction && (
            <button
              type="button"
              role="menuitem"
              onClick={(e) => runAction(e, onToggleActivate)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink [&>svg:first-child]:-ml-1 hover:bg-surface-hover"
            >
              <StatusIcon size={14} />
              {statusLabel}
            </button>
          )}
          {/* Active/Inactive toggle above never reaches Suspended — without
              this, getting there means opening the full edit form just to
              change one dropdown. Not shown when already Suspended, since
              Activate (above) already covers getting back out. */}
          {partner.status !== 'Suspended' && (
            <button
              type="button"
              role="menuitem"
              onClick={(e) => runAction(e, onSuspend)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink [&>svg:first-child]:-ml-1 hover:bg-surface-hover"
            >
              <Ban size={14} />
              Suspend
            </button>
          )}
          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            onClick={(e) => runAction(e, onRequestDelete)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger [&>svg:first-child]:-ml-1 hover:bg-danger-soft"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
