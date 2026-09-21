import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '../../data/mockCustomers'

const TIER_OPTIONS = CUSTOMER_TIERS.map((t) => ({ value: t, label: t }))
const STATUS_OPTIONS = CUSTOMER_STATUSES.map((s) => ({ value: s, label: s }))

function buildInitialState(mode, initialCustomer) {
  if (mode === 'edit' && initialCustomer) {
    return {
      name: initialCustomer.name || '',
      email: initialCustomer.email || '',
      phone: initialCustomer.phone || '',
      loyaltyCard: initialCustomer.loyaltyCard || '',
      tier: initialCustomer.tier || 'Bronze',
      status: initialCustomer.status || 'Active',
    }
  }
  return { name: '', email: '', phone: '', loyaltyCard: '', tier: 'Bronze', status: 'Active' }
}

const digitsOnly = (s) => s.replace(/\D/g, '')

function computeErrors(fields, existingCustomers, currentId) {
  const errors = {}

  if (!fields.name.trim()) errors.name = 'Customer name is required'

  const email = fields.email.trim()
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'

  if (!fields.phone.trim()) errors.phone = 'Phone is required'

  const card = fields.loyaltyCard.trim()
  if (!card) {
    errors.loyaltyCard = 'Loyalty card number is required'
  } else {
    const duplicate = (existingCustomers || []).some(
      (c) => c.id !== currentId && digitsOnly(c.loyaltyCard || '') === digitsOnly(card)
    )
    if (duplicate) errors.loyaltyCard = 'This card number is already in use'
  }

  return errors
}

const inputBaseClass =
  'h-10 w-full rounded-lg border bg-surface px-3 text-sm font-medium text-ink transition-all duration-200 focus:outline-none'

function fieldBorderClass(hasError) {
  return hasError
    ? 'border-danger'
    : 'border-border hover:border-border-hover focus:border-ink'
}

export default function CustomerForm({
  open,
  mode,
  initialCustomer,
  existingCustomers,
  onClose,
  onSubmit,
}) {
  const [fields, setFields] = useState(() => buildInitialState(mode, initialCustomer))
  const [touched, setTouched] = useState({})
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false)

  useEffect(() => {
    if (!open) return
    setFields(buildInitialState(mode, initialCustomer))
    setTouched({})
    setShowDuplicateBanner(false)
  }, [open, initialCustomer, mode])

  if (!open) return null

  const currentId = mode === 'edit' && initialCustomer ? initialCustomer.id : null
  const errors = computeErrors(fields, existingCustomers, currentId)

  const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    if (field === 'loyaltyCard') setShowDuplicateBanner(false)
  }

  const handleSubmit = () => {
    setTouched({ name: true, email: true, phone: true, loyaltyCard: true })

    const submitErrors = computeErrors(fields, existingCustomers, currentId)

    if (submitErrors.loyaltyCard === 'This card number is already in use') {
      setShowDuplicateBanner(true)
    }

    if (Object.keys(submitErrors).length > 0) return

    onSubmit({
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      loyaltyCard: fields.loyaltyCard.trim(),
      tier: fields.tier,
      status: fields.status,
    })
  }

  const nameHasError = touched.name && !!errors.name
  const emailHasError = touched.email && !!errors.email
  const phoneHasError = touched.phone && !!errors.phone
  const cardHasError = touched.loyaltyCard && !!errors.loyaltyCard

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Customer' : 'Edit Customer'}
      footer={
        <div className="flex items-center justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Create Customer' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      {showDuplicateBanner && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          <span>A customer with this loyalty card number already exists.</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Full Name</label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(nameHasError)}`}
            value={fields.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
          />
          {nameHasError && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(emailHasError)}`}
            value={fields.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {emailHasError && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Phone</label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(phoneHasError)}`}
            value={fields.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
          />
          {phoneHasError && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Loyalty Card Number</label>
          <input
            type="text"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(cardHasError)}`}
            placeholder="e.g. 4000 1122 3344"
            value={fields.loyaltyCard}
            onChange={(e) => handleFieldChange('loyaltyCard', e.target.value)}
            onBlur={() => handleBlur('loyaltyCard')}
          />
          {cardHasError && <p className="mt-1 text-xs text-danger">{errors.loyaltyCard}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Tier</label>
          <Dropdown
            label="Tier"
            className="mt-1"
            value={fields.tier}
            onChange={(value) => handleFieldChange('tier', value)}
            options={TIER_OPTIONS}
            triggerBg="bg-surface"
            triggerBorder="border-border"
          />
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
      </div>
    </Drawer>
  )
}
