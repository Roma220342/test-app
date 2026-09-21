import { Wallet, Clock, Globe, Gift, Info } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Avatar from '../ui/Avatar'
import { StatusBadge, TypeBadge } from '../ui/Badge'
import Button from '../ui/Button'
import PartnerActionsMenu from '../list/PartnerActionsMenu'
import { statusAction } from '../../utils/statusAction'

function SectionLabel({ children }) {
  return (
    <div className="text-xs font-medium tracking-wide text-ink-faint">
      {children}
    </div>
  )
}

function Row({ icon: Icon, label, hint, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-1.5 text-sm text-ink-soft">
        {Icon && <Icon size={16} className="text-ink-faint" />}
        {label}
        {hint && (
          <Info size={13} className="text-ink-faint" aria-hidden="true" title={hint} />
        )}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  )
}

export default function PartnerDetailPanel({
  open,
  partner,
  onClose,
  onEdit,
  onDuplicate,
  onToggleActivate,
  onSuspend,
  onRequestDelete,
}) {
  if (!partner) return null

  const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' }
  const formattedDate = new Date(partner.createdAt).toLocaleDateString('en-GB', dateFormat)
  const formattedUpdatedDate = new Date(partner.updatedAt).toLocaleDateString('en-GB', dateFormat)
  const hasLimit = (partner.config?.bmoAmount || '').toLowerCase() !== 'no limit'

  const { label: actionLabel, icon: ActionIcon } = statusAction(partner.status)

  // Same menu as the card's kebab — Edit/Duplicate/Delete live in one place
  // now, so this panel and the card can never offer a different set of
  // actions for the same partner.
  const headerActions = (
    <PartnerActionsMenu
      partner={partner}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onToggleActivate={onToggleActivate}
      onSuspend={onSuspend}
      onRequestDelete={onRequestDelete}
      showStatusAction={false}
    />
  )

  // Delete now lives only in the menu above — a single path to a
  // destructive action instead of two. The footer keeps just the one
  // primary, non-destructive action for this record's status.
  const footer = (
    <div className="flex items-center justify-end">
      <Button variant="primary" onClick={() => onToggleActivate(partner)}>
        <ActionIcon size={16} />
        {actionLabel}
      </Button>
    </div>
  )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Partner Details"
      headerActions={headerActions}
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <Avatar name={partner.name} logo={partner.logo} size="lg" />
          <div className="mt-3">
            <div className="text-xl font-semibold text-ink">{partner.name}</div>
            <div className="text-sm text-ink-faint">{partner.code}</div>
            <div className="mt-2 flex gap-2">
              <TypeBadge type={partner.type} />
              <StatusBadge status={partner.status} />
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Configuration</SectionLabel>
          <div className="mt-2 rounded-xl border border-border divide-y divide-border">
            <Row
              icon={Wallet}
              label="BMO Limit"
              hint="Maximum bonus/transaction amount this partner can process, before any per-transaction limit rules apply."
              value={partner.config.bmoAmount}
            />
            {hasLimit && (
              <Row
                icon={Clock}
                label="BMO Timing"
                hint="Whether the limit is applied immediately or after settlement."
                value={partner.config.bmoTiming || '—'}
              />
            )}
            <Row icon={Globe} label="Web Access" value={partner.config.web} />
            <Row icon={Gift} label="Gift Access" value={partner.config.gift} />
          </div>
        </div>

        <div>
          <SectionLabel>Details</SectionLabel>
          <div className="mt-2 rounded-xl border border-border divide-y divide-border">
            <Row label="Partner Type" value={partner.type} />
            <Row label="Created" value={formattedDate} />
            <Row label="Last Updated" value={formattedUpdatedDate} />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
