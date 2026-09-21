import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Pencil, Coins, Ticket, UserMinus, Trash2 } from 'lucide-react'
import { customerStatusAction } from '../../utils/customerStatusAction'

export default function CustomerActionsMenu({
  customer,
  onEdit,
  onAdjustPoints,
  onToggleStatus,
  onAssignOffer,
  onRequestAnonymize,
  onRequestDelete,
  align = 'right',
  // The detail panel already has Adjust Points as its own primary footer
  // button, so it hides this menu item to avoid offering the same action
  // twice in one view. The table row has no such button, so it keeps it.
  showAdjustPoints = true,
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
    action(customer)
  }

  const { label: statusLabel, icon: StatusIcon } = customerStatusAction(customer.status)
  const isAnonymized = !!customer.anonymizedAt

  const itemClass =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink [&>svg:first-child]:-ml-1 hover:bg-surface-sunken'
  const dangerItemClass =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger [&>svg:first-child]:-ml-1 hover:bg-danger-soft'

  return (
    <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink-soft"
        aria-label="Open customer actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-9 z-20 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-sm`}
        >
          {/* A GDPR erasure is terminal: everything that would write personal
              data or new marketing back onto the record is gone, leaving only
              the ability to remove the record entirely. */}
          {isAnonymized ? (
            <button
              type="button"
              role="menuitem"
              onClick={(e) => runAction(e, onRequestDelete)}
              className={dangerItemClass}
            >
              <Trash2 size={14} />
              Delete
            </button>
          ) : (
            <>
              <button type="button" role="menuitem" onClick={(e) => runAction(e, onEdit)} className={itemClass}>
                <Pencil size={14} />
                Edit profile
              </button>
              {showAdjustPoints && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => runAction(e, onAdjustPoints)}
                  className={itemClass}
                >
                  <Coins size={14} />
                  Adjust points
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={(e) => runAction(e, onAssignOffer)}
                className={itemClass}
              >
                <Ticket size={14} />
                Assign offer
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={(e) => runAction(e, onToggleStatus)}
                className={itemClass}
              >
                <StatusIcon size={14} />
                {statusLabel}
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                role="menuitem"
                onClick={(e) => runAction(e, onRequestAnonymize)}
                className={dangerItemClass}
              >
                <UserMinus size={14} />
                Anonymize
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={(e) => runAction(e, onRequestDelete)}
                className={dangerItemClass}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
