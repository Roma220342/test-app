import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

// Custom dropdown — deliberately not a native <select>, per design spec:
// white rounded panel, soft shadow, gray-hover options, checkmark on the
// selected row, and a fade+slide-down open animation.
export default function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  hasError = false,
  onBlur,
  className = '',
  triggerClassName = '',
  triggerBg = 'bg-surface-sunken',
  triggerBorder = 'border-transparent',
}) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)

  const selected = options.find((opt) => opt.value === value)

  const close = (fireBlur) => {
    setOpen(false)
    setHighlighted(-1)
    if (fireBlur) onBlur?.()
  }

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close(true)
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close(true)
        triggerRef.current?.focus()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlighted((i) => Math.min(i + 1, options.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlighted((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (highlighted >= 0 && options[highlighted]) {
          onChange(options[highlighted].value)
          close(true)
          triggerRef.current?.focus()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, highlighted, options])

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      const currentIndex = options.findIndex((opt) => opt.value === value)
      setHighlighted(currentIndex >= 0 ? currentIndex : 0)
    }
  }

  const handleTriggerBlur = () => {
    // Only counts as a real blur if the click-outside handler hasn't
    // already handled it (i.e. the user tabbed away without opening it).
    if (!open) onBlur?.()
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <span className="sr-only">{label}</span>}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          setOpen((v) => !v)
          const currentIndex = options.findIndex((opt) => opt.value === value)
          setHighlighted(currentIndex >= 0 ? currentIndex : 0)
        }}
        onKeyDown={handleTriggerKeyDown}
        onBlur={handleTriggerBlur}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border ${triggerBg} px-3 text-left text-sm font-medium text-ink transition-all duration-200 focus:outline-none [&>svg:last-child]:-mr-1 ${
          hasError
            ? 'border-danger'
            : `${triggerBorder} hover:border-border-hover focus:border-ink`
        } ${triggerClassName}`}
      >
        <span className={`truncate ${selected ? 'text-ink' : 'text-ink-faint'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-faint transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="dropdown-panel no-native-scrollbar absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-lg"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => {
                    onChange(opt.value)
                    close(true)
                    triggerRef.current?.focus()
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-4 py-2.5 text-left text-sm transition-colors [&>svg:last-child]:-mr-1 ${
                    isSelected ? 'font-semibold text-ink' : 'font-normal text-ink-soft'
                  } ${highlighted === i ? 'bg-surface-sunken' : ''}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="shrink-0 text-ink" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
