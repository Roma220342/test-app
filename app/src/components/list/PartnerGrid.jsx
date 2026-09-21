import SkeletonCard from '../ui/SkeletonCard'
import PartnerCard from './PartnerCard'
import EmptyState from './EmptyState'

const GRID_CLASS = 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'

export default function PartnerGrid({
  partners,
  isLoading,
  hasAnyPartners,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onToggleActivate,
  onSuspend,
  onRequestDelete,
  onClearFilters,
  onOpenCreate,
}) {
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div>
        {hasAnyPartners ? (
          <EmptyState variant="no-results" onAction={onClearFilters} />
        ) : (
          <EmptyState variant="no-partners" onAction={onOpenCreate} />
        )}
      </div>
    )
  }

  return (
    <div className={GRID_CLASS}>
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onToggleActivate={onToggleActivate}
          onSuspend={onSuspend}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  )
}
