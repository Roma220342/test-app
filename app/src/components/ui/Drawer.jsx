import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import ScrollArea from './ScrollArea'

const SIZES = {
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

// `contentKey` identifies which content the drawer is currently showing. When
// it changes the body and footer remount, so the cross-fade replays — that is
// what makes an in-place mode switch (view → edit) read as the same panel
// changing rather than a second panel sliding in.
export default function Drawer({
  open,
  onClose,
  title,
  headerActions,
  children,
  footer,
  size = 'md',
  contentKey,
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`drawer-panel relative my-3 mr-3 flex h-[calc(100%-1.5rem)] w-full ${SIZES[size]} flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl transition-[max-width] duration-300 ease-out`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 key={`title-${contentKey}`} className="content-swap text-base font-semibold text-ink">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <ScrollArea className="min-h-0 flex-1" innerClassName="px-6 py-5">
          <div key={`body-${contentKey}`} className="content-swap">
            {children}
          </div>
        </ScrollArea>
        {footer && (
          <div key={`footer-${contentKey}`} className="content-swap border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
