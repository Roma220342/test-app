import { useEffect, useState } from 'react'
import { AlertCircle, Info } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import Toggle from '../ui/Toggle'

const TYPE_OPTIONS = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' },
]

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Pending Review', label: 'Pending Review' },
  { value: 'Suspended', label: 'Suspended' },
]

const BMO_TIMING_OPTIONS = [
  { value: 'Immediate', label: 'Immediate' },
  { value: 'Delayed', label: 'Delayed' },
]

const EMPTY_CONFIG = { bmoAmount: '', bmoTiming: 'Immediate', web: 'No', gift: 'No' }

function buildInitialState(mode, initialPartner) {
  if (mode === 'edit' && initialPartner) {
    return {
      name: initialPartner.name || '',
      code: initialPartner.code || '',
      type: initialPartner.type || '',
      status: initialPartner.status || 'Pending Review',
      config: {
        bmoAmount: initialPartner.config?.bmoAmount ?? '',
        bmoTiming: initialPartner.config?.bmoTiming ?? 'Immediate',
        web: initialPartner.config?.web ?? 'No',
        gift: initialPartner.config?.gift ?? 'No',
      },
    }
  }
  return {
    name: '',
    code: '',
    type: '',
    status: 'Pending Review',
    config: { ...EMPTY_CONFIG },
  }
}

function computeErrors(fields, existingPartners, currentId) {
  const errors = {}

  if (!fields.name.trim()) {
    errors.name = 'Partner name is required'
  }

  const trimmedCode = fields.code.trim()
  if (!trimmedCode) {
    errors.code = 'Partner code is required'
  } else {
    const duplicate = (existingPartners || []).some(
      (p) =>
        p.id !== currentId &&
        (p.code || '').toLowerCase() === trimmedCode.toLowerCase()
    )
    if (duplicate) {
      errors.code = 'This code is already in use'
    }
  }

  if (!fields.type) {
    errors.type = 'Please select a partner type'
  }

  return errors
}

const inputBaseClass =
  'h-10 w-full rounded-lg border bg-surface px-3 text-sm font-medium text-ink transition-all duration-200 focus:outline-none'

// Error state always shows the danger border, focus or not — a plain solid
// ink border is the only focus indicator otherwise, no glow/ring. A visible
// resting stroke (not a gray fill) defines the field, matching the search
// bar. Ink, not the brand red, since a text input's focus ring is a
// secondary UI element.
function fieldBorderClass(hasError) {
  return hasError
    ? 'border-danger'
    : 'border-border hover:border-border-hover focus:border-ink'
}

export default function PartnerForm({
  open,
  mode,
  initialPartner,
  existingPartners,
  onClose,
  onSubmit,
}) {
  const [fields, setFields] = useState(() =>
    buildInitialState(mode, initialPartner)
  )
  const [touched, setTouched] = useState({})
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false)

  useEffect(() => {
    if (!open) return
    setFields(buildInitialState(mode, initialPartner))
    setTouched({})
    setShowDuplicateBanner(false)
  }, [open, initialPartner, mode])

  if (!open) return null

  const currentId = mode === 'edit' && initialPartner ? initialPartner.id : null
  const errors = computeErrors(fields, existingPartners, currentId)

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

  const handleSubmit = () => {
    // The button is never disabled — clicking it while the form is
    // incomplete is exactly what reveals the field-level errors below, so a
    // disabled state would silently hide the validation it's meant to show.
    setTouched({ name: true, code: true, type: true })

    const submitErrors = computeErrors(fields, existingPartners, currentId)

    if (submitErrors.code === 'This code is already in use') {
      setShowDuplicateBanner(true)
    }

    if (Object.keys(submitErrors).length > 0) {
      return
    }

    const noLimit = fields.config.bmoAmount.trim().toLowerCase() === 'no limit'

    onSubmit({
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

  const nameHasError = touched.name && !!errors.name
  const codeHasError = touched.code && !!errors.code
  const typeHasError = touched.type && !!errors.type

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Partner' : 'Edit Partner'}
      footer={
        <div className="flex items-center justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Create Partner' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      {showDuplicateBanner && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            A partner with this code already exists. Please choose a
            different code.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">
            Partner Name
          </label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(nameHasError)}`}
            value={fields.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
          />
          {nameHasError && (
            <p className="mt-1 text-xs text-danger">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">
            Partner Code
          </label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(codeHasError)}`}
            value={fields.code}
            onChange={(e) => handleFieldChange('code', e.target.value)}
            onBlur={() => handleBlur('code')}
          />
          {codeHasError && (
            <p className="mt-1 text-xs text-danger">{errors.code}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Type</label>
          <Dropdown
            label="Type"
            className="mt-1"
            value={fields.type}
            onChange={(value) => handleFieldChange('type', value)}
            onBlur={() => handleBlur('type')}
            options={TYPE_OPTIONS}
            placeholder="Select type…"
            hasError={typeHasError}
            triggerBg="bg-surface"
            triggerBorder="border-border"
          />
          {typeHasError && (
            <p className="mt-1 text-xs text-danger">{errors.type}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Status</label>
          <Dropdown
            label="Status"
            className="mt-1"
            value={fields.status}
            onChange={(value) => handleFieldChange('status', value)}
            options={STATUS_OPTIONS}
            triggerBg="bg-surface"
            triggerBorder="border-border"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
            BMO Limit
            <Info
              size={13}
              className="text-ink-faint"
              aria-hidden="true"
              title="Maximum bonus/transaction amount this partner can process, and whether it applies immediately or after settlement."
            />
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              className={`${inputBaseClass} flex-1 ${fieldBorderClass(false)}`}
              placeholder="e.g. 10L or No limit"
              value={fields.config.bmoAmount}
              onChange={(e) => handleConfigChange('bmoAmount', e.target.value)}
            />
            <Dropdown
              label="BMO Timing"
              className="w-36 shrink-0"
              value={fields.config.bmoTiming}
              onChange={(value) => handleConfigChange('bmoTiming', value)}
              options={BMO_TIMING_OPTIONS}
              triggerBg="bg-surface"
              triggerBorder="border-border"
            />
          </div>
          <p className="mt-1 text-xs text-ink-faint">Timing only applies when a limit amount is set.</p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Web Access</label>
          <Toggle
            checked={fields.config.web === 'Yes'}
            onChange={(checked) => handleConfigChange('web', checked ? 'Yes' : 'No')}
            label="Web Access"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Gift Access</label>
          <Toggle
            checked={fields.config.gift === 'Yes'}
            onChange={(checked) => handleConfigChange('gift', checked ? 'Yes' : 'No')}
            label="Gift Access"
          />
        </div>
      </div>
    </Drawer>
  )
}
