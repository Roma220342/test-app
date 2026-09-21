import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, children, className = '' }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
