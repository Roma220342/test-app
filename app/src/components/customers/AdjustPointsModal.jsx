import { useEffect, useState } from 'react'
import { Coins } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const inputBaseClass =
  'h-10 w-full rounded-lg border bg-surface px-3 text-sm font-medium text-ink transition-all duration-200 focus:outline-none'

function fieldBorderClass(hasError) {
  return hasError
    ? 'border-danger'
    : 'border-border hover:border-border-hover focus:border-ink'
}

function computeErrors(amount, reason, currentBalance) {
  const errors = {}
  const parsed = Number(amount)

  if (!amount.trim()) errors.amount = 'Enter an amount'
  else if (!Number.isInteger(parsed)) errors.amount = 'Enter a whole number'
  else if (parsed === 0) errors.amount = 'Amount cannot be zero'
  else if (currentBalance + parsed < 0)
    errors.amount = `Cannot deduct more than the current balance (${currentBalance.toLocaleString('en-GB')})`

  // The reason is written into the customer-visible adjustment record, so it
  // is mandatory rather than a nicety.
  if (!reason.trim()) errors.reason = 'A reason is required'

  return errors
}

export default function AdjustPointsModal({ open, customer, onClose, onConfirm }) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!open) return
    setAmount('')
    setReason('')
    setTouched({})
  }, [open, customer])

  if (!open || !customer) return null

  const errors = computeErrors(amount, reason, customer.pointsBalance)
  const parsed = Number(amount)
  const isValidPreview = amount.trim() && Number.isInteger(parsed) && parsed !== 0
  const newBalance = isValidPreview ? customer.pointsBalance + parsed : customer.pointsBalance

  const handleSubmit = () => {
    setTouched({ amount: true, reason: true })
    if (Object.keys(computeErrors(amount, reason, customer.pointsBalance)).length > 0) return
    onConfirm({ delta: parsed, reason: reason.trim() })
  }

  const amountHasError = touched.amount && !!errors.amount
  const reasonHasError = touched.reason && !!errors.reason

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
        <Coins className="text-ink-soft" size={22} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-ink">Adjust points</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {customer.name} · current balance{' '}
        <span className="font-medium text-ink">
          {customer.pointsBalance.toLocaleString('en-GB')}
        </span>
      </p>

      <div className="mt-5 space-y-4 text-left">
        <div>
          <label className="text-sm font-medium text-ink">Amount</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 500 to award, -200 to deduct"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(amountHasError)}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          />
          {amountHasError ? (
            <p className="mt-1 text-xs text-danger">{errors.amount}</p>
          ) : (
            <p className="mt-1 text-xs text-ink-faint">
              New balance: <span className="font-medium text-ink-soft">{newBalance.toLocaleString('en-GB')}</span>
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Reason</label>
          <input
            type="text"
            placeholder="Shown to the customer on their statement"
            className={`mt-1 ${inputBaseClass} ${fieldBorderClass(reasonHasError)}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, reason: true }))}
          />
          {reasonHasError && <p className="mt-1 text-xs text-danger">{errors.reason}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Apply adjustment
        </Button>
      </div>
    </Modal>
  )
}
