import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, { variant = 'success', onUndo } = {}) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, variant, onUndo }])
      // Undo-capable toasts stay up longer — the whole point is giving the
      // user a real chance to react before the window closes.
      setTimeout(() => dismiss(id), onUndo ? 6000 : 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="toast-enter flex items-center gap-2.5 rounded-md border border-border bg-ink px-4 py-3 text-sm text-white shadow-lg"
            >
              {t.variant === 'error' ? (
                <AlertCircle size={16} className="shrink-0 text-status-suspended" />
              ) : (
                <CheckCircle2 size={16} className="shrink-0 text-status-active" />
              )}
              <span className="max-w-xs">{t.message}</span>
              {t.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    t.onUndo()
                    dismiss(t.id)
                  }}
                  className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:text-white/80"
                >
                  Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="ml-1 text-white/60 transition-colors hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
