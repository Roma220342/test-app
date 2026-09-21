import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

export default function Pagination({ page, pageCount, totalCount, pageSize, onPageChange }) {
  if (pageCount <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between px-1 pt-1">
      <p className="text-xs text-ink-faint">
        Showing <span className="font-medium text-ink-soft">{start}–{end}</span> of{' '}
        <span className="font-medium text-ink-soft">{totalCount}</span>
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-1.5"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-xs font-medium text-ink-soft">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className="px-1.5"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
