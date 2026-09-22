import { useEffect, useState } from 'react'
import { Wallet, Clock, Globe, Gift, Info, AlertCircle } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Avatar from '../ui/Avatar'
import { StatusBadge, TypeBadge } from '../ui/Badge'
import Button from '../ui/Button'
import PartnerActionsMenu from '../list/PartnerActionsMenu'
import PartnerFormFields, { buildInitialState, computeErrors } from '../form/PartnerFormFields'
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
  existingPartners,
  isEditing,
  onCancelEdit,
  onSubmitEdit,
}) {
  const [fields, setFields] = useState(() => buildInitialState('edit', partner))
  const [touched, setTouched] = useState({})
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false)

  // Re-seed the form from the current record each time editing starts, so a
  // second edit never shows stale values left over from the first.
  useEffect(() => {
    if (!isEditing || !partner) return
    setFields(buildInitialState('edit', partner))
    setTouched({})
    setShowDuplicateBanner(false)
  }, [isEditing, partner])

  if (!partner) return null

  const errors = computeErrors(fields, existingPartners, partner.id)

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    if (field === 'code') {
      setShowDuplicateBanner(false)
    }
  }

  const handleConfigChange = (field, value) => {
    setFields((prev) => ({
      ...prev,
      config: { ...prev.config, [field]: value },
    }))
  }

  const handleSaveEdit = () => {
    setTouched({ name: true, code: true, type: true })

    const submitErrors = computeErrors(fields, existingPartners, partner.id)

    if (submitErrors.code === 'This code is already in use') {
      setShowDuplicateBanner(true)
    }

    if (Object.keys(submitErrors).length > 0) {
      return
    }

    const noLimit = fields.config.bmoAmount.trim().toLowerCase() === 'no limit'

    onSubmitEdit(partner.id, {
      name: fields.name.trim(),
      code: fields.code.trim(),
      type: fields.type,
      status: fields.status,
      config: {
        bmoAmount: fields.config.bmoAmount,
        bmoTiming: noLimit ? null : fields.config.bmoTiming,
        web: fields.config.web,
        gift: fields.config.gift,
      },
    })
  }

  const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' }
  const formattedDate = new Date(partner.createdAt).toLocaleDateString('en-GB', dateFormat)
  const formattedUpdatedDate = new Date(partner.updatedAt).toLocaleDateString('en-GB', dateFormat)
  const hasLimit = (partner.config?.bmoAmount || '').toLowerCase() !== 'no limit'

  const { label: actionLabel, icon: ActionIcon } = statusAction(partner.status)

  // Same menu as the card's kebab — Edit/Duplicate/Delete live in one place
  // now, so this panel and the card can never offer a different set of
  // actions for the same partner.
  const headerActions = !isEditing && (
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
  const footer = isEditing ? (
    <div className="flex items-center justify-end gap-4">
      <Button variant="secondary" onClick={onCancelEdit}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSaveEdit}>
        Save Changes
      </Button>
    </div>
  ) : (
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
      title={isEditing ? 'Edit Partner' : 'Partner Details'}
      headerActions={headerActions}
      footer={footer}
      contentKey={`${partner.id}-${isEditing ? 'edit' : 'view'}`}
    >
      {isEditing ? (
        <>
          {showDuplicateBanner && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} className="shrink-0" />
              <span>
                A partner with this code already exists. Please choose a
                different code.
              </span>
            </div>
          )}
          <PartnerFormFields
            fields={fields}
            touched={touched}
            errors={errors}
            onFieldChange={handleFieldChange}
            onConfigChange={handleConfigChange}
            onBlur={handleBlur}
          />
        </>
      ) : (
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
      )}
    </Drawer>
  )
}
