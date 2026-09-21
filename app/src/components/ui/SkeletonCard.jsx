export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="skeleton-pulse h-12 w-12 rounded-md bg-surface-sunken" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton-pulse h-4 w-3/5 rounded bg-surface-sunken" />
          <div className="skeleton-pulse h-3 w-2/5 rounded bg-surface-sunken" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="skeleton-pulse h-6 w-16 rounded-lg bg-surface-sunken" />
        <div className="skeleton-pulse h-6 w-14 rounded-lg bg-surface-sunken" />
      </div>
      <div className="mt-3 flex justify-between border-t border-border pt-4">
        <div className="skeleton-pulse h-3 w-1/4 rounded bg-surface-sunken" />
        <div className="skeleton-pulse h-3 w-1/4 rounded bg-surface-sunken" />
        <div className="skeleton-pulse h-3 w-1/4 rounded bg-surface-sunken" />
      </div>
    </div>
  )
}
