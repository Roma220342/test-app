import { Info } from 'lucide-react'
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

export function buildInitialState(mode, initialPartner) {
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

export function computeErrors(fields, existingPartners, currentId) {
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

// Shared by PartnerForm (create, in its own drawer) and PartnerDetailPanel
// (edit, inline in the same drawer) so the two never drift apart.
export default function PartnerFormFields({
  fields,
  touched,
  errors,
  onFieldChange,
  onConfigChange,
  onBlur,
}) {
  const nameHasError = touched.name && !!errors.name
  const codeHasError = touched.code && !!errors.code
  const typeHasError = touched.type && !!errors.type

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">
          Partner Name
        </label>
        <input
          type="text"
          className={`mt-1 ${inputBaseClass} ${fieldBorderClass(nameHasError)}`}
          value={fields.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
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
          onChange={(e) => onFieldChange('code', e.target.value)}
          onBlur={() => onBlur('code')}
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
          onChange={(value) => onFieldChange('type', value)}
          onBlur={() => onBlur('type')}
          options={TYPE_OPTIONS}
          placeholder="Select type…"
          hasError={typeHasError}
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
          onChange={(value) => onFieldChange('status', value)}
          options={STATUS_OPTIONS}
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
            onChange={(e) => onConfigChange('bmoAmount', e.target.value)}
          />
          <Dropdown
            label="BMO Timing"
            className="w-36 shrink-0"
            value={fields.config.bmoTiming}
            onChange={(value) => onConfigChange('bmoTiming', value)}
            options={BMO_TIMING_OPTIONS}
          />
        </div>
        <p className="mt-1 text-xs text-ink-faint">Timing only applies when a limit amount is set.</p>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink">Web Access</label>
        <Toggle
          checked={fields.config.web === 'Yes'}
          onChange={(checked) => onConfigChange('web', checked ? 'Yes' : 'No')}
          label="Web Access"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink">Gift Access</label>
        <Toggle
          checked={fields.config.gift === 'Yes'}
          onChange={(checked) => onConfigChange('gift', checked ? 'Yes' : 'No')}
          label="Gift Access"
        />
      </div>
    </div>
  )
}
