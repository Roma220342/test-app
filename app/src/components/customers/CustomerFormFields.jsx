import Dropdown from '../ui/Dropdown'
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '../../data/mockCustomers'

const TIER_OPTIONS = CUSTOMER_TIERS.map((t) => ({ value: t, label: t }))
const STATUS_OPTIONS = CUSTOMER_STATUSES.map((s) => ({ value: s, label: s }))

export function buildInitialState(mode, initialCustomer) {
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

export function computeErrors(fields, existingCustomers, currentId) {
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

// Shared by CustomerForm (create, in its own drawer) and CustomerDetailPanel
// (edit, inline in the same drawer) so the two never drift apart.
export default function CustomerFormFields({ fields, touched, errors, onFieldChange, onBlur }) {
  const nameHasError = touched.name && !!errors.name
  const emailHasError = touched.email && !!errors.email
  const phoneHasError = touched.phone && !!errors.phone
  const cardHasError = touched.loyaltyCard && !!errors.loyaltyCard

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Full Name</label>
        <input
          type="text"
          className={`mt-1 ${inputBaseClass} ${fieldBorderClass(nameHasError)}`}
          value={fields.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
        />
        {nameHasError && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Email</label>
        <input
          type="text"
          className={`mt-1 ${inputBaseClass} ${fieldBorderClass(emailHasError)}`}
          value={fields.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
        />
        {emailHasError && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Phone</label>
        <input
          type="text"
          className={`mt-1 ${inputBaseClass} ${fieldBorderClass(phoneHasError)}`}
          value={fields.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          onBlur={() => onBlur('phone')}
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
          onChange={(e) => onFieldChange('loyaltyCard', e.target.value)}
          onBlur={() => onBlur('loyaltyCard')}
        />
        {cardHasError && <p className="mt-1 text-xs text-danger">{errors.loyaltyCard}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Tier</label>
        <Dropdown
          label="Tier"
          className="mt-1"
          value={fields.tier}
          onChange={(value) => onFieldChange('tier', value)}
          options={TIER_OPTIONS}
        />
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
    </div>
  )
}
