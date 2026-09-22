import { Wallet, Globe, Gift } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { StatusBadge, TypeBadge } from '../ui/Badge'
import PartnerActionsMenu from './PartnerActionsMenu'

export default function PartnerCard({
  partner,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onToggleActivate,
  onSuspend,
  onRequestDelete,
}) {
  const hasLimit = (partner.config?.bmoAmount || '').toLowerCase() !== 'no limit'

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for ${partner.name}`}
      onClick={() => onOpenDetail(partner)}
      onKeyDown={(e) => {
        // Only react when the card itself is focused — a nested control
        // (the "⋮" menu button) already handles its own Enter/Space, and
        // this bubbling handler must not also fire for it.
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail(partner)
        }
      }}
      className="cursor-pointer rounded-xl border border-border bg-surface p-4 transition-colors duration-200 hover:border-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={partner.name} logo={partner.logo} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{partner.name}</p>
            <p className="mt-1 truncate text-xs text-ink-faint">{partner.code}</p>
          </div>
        </div>

        <div className="-mr-2">
          <PartnerActionsMenu
            partner={partner}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleActivate={onToggleActivate}
            onSuspend={onSuspend}
            onRequestDelete={onRequestDelete}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TypeBadge type={partner.type} />
        <StatusBadge status={partner.status} />
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs font-normal text-ink-soft">
        <span className="flex items-center gap-1 whitespace-nowrap leading-none">
          <Wallet size={14} className="shrink-0 text-ink-faint" />
          BMO: {partner.config?.bmoAmount}
          {hasLimit && partner.config?.bmoTiming ? ` (${partner.config.bmoTiming})` : ''}
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap leading-none">
          <Globe size={14} className="shrink-0 text-ink-faint" />
          Web: {partner.config?.web}
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap leading-none">
          <Gift size={14} className="shrink-0 text-ink-faint" />
          Gift: {partner.config?.gift}
        </span>
      </div>
    </div>
  )
}
