export default function SkeletonRow() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="skeleton-pulse h-9 w-9 shrink-0 rounded-lg bg-surface-sunken" />
          <div className="skeleton-pulse h-4 w-32 rounded bg-surface-sunken" />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="skeleton-pulse h-3.5 w-40 rounded bg-surface-sunken" />
      </td>
      <td className="px-4 py-3">
        <div className="skeleton-pulse h-6 w-16 rounded-lg bg-surface-sunken" />
      </td>
      <td className="px-4 py-3">
        <div className="skeleton-pulse h-3.5 w-14 rounded bg-surface-sunken" />
      </td>
      <td className="px-4 py-3">
        <div className="skeleton-pulse h-3.5 w-20 rounded bg-surface-sunken" />
      </td>
      <td className="px-4 py-3">
        <div className="skeleton-pulse h-8 w-8 rounded-lg bg-surface-sunken" />
      </td>
    </tr>
  )
}
