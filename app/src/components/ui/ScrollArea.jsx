import { useCallback, useEffect, useRef, useState } from 'react'

// Custom scrollbar: the native one is fully hidden (see .no-native-scrollbar
// in index.css) and replaced with this JS-driven thumb, so there is no
// browser-drawn scrollbar at all — and therefore no arrow buttons, on any
// browser/OS theme, guaranteed.
export default function ScrollArea({ className = '', innerClassName = '', children }) {
  const viewportRef = useRef(null)
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false })
  const [dragging, setDragging] = useState(false)

  const update = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight <= clientHeight + 1) {
      setThumb((t) => (t.visible ? { ...t, visible: false } : t))
      return
    }
    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 28)
    const maxTop = clientHeight - thumbHeight
    const maxScroll = scrollHeight - clientHeight
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0
    setThumb({ height: thumbHeight, top, visible: true })
  }, [])

  useEffect(() => {
    update()
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update, children])

  useEffect(() => {
    if (!dragging) return

    const handleMove = (e) => {
      const el = viewportRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const { scrollHeight, clientHeight } = el
      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 28)
      const maxTop = clientHeight - thumbHeight
      const y = e.clientY - rect.top - thumbHeight / 2
      const ratio = maxTop > 0 ? Math.min(Math.max(y / maxTop, 0), 1) : 0
      el.scrollTop = ratio * (scrollHeight - clientHeight)
    }
    const handleUp = () => setDragging(false)

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [dragging])

  return (
    <div className={`group/scroll relative ${className}`}>
      <div
        ref={viewportRef}
        onScroll={update}
        className={`no-native-scrollbar h-full w-full overflow-y-auto ${innerClassName}`}
      >
        {children}
      </div>
      {thumb.visible && (
        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          className={`absolute right-0 w-0.5 cursor-pointer rounded-full transition-colors ${
            dragging ? 'bg-ink-faint/70' : 'bg-ink-faint/0 group-hover/scroll:bg-ink-faint/40'
          }`}
          style={{ height: thumb.height, top: thumb.top }}
        />
      )}
    </div>
  )
}
