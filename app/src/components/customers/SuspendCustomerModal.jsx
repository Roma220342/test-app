import { useEffect, useState } from 'react'
import { PauseCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const inputBaseClass =
  'h-10 w-full rounded-lg border bg-surface px-3 text-sm font-medium text-ink transition-all duration-200 focus:outline-none'

export default function SuspendCustomerModal({ open, customer, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setReason('')
    setTouched(false)
  }, [open, customer])

  if (!open || !customer) return null

  const hasError = touched && !reason.trim()

  const handleSubmit = () => {
    setTouched(true)
    if (!reason.trim()) return
    onConfirm({ reason: reason.trim() })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
        <PauseCircle className="text-ink-soft" size={22} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-ink">Suspend this account?</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {customer.name} will not be able to earn or redeem while suspended.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium text-ink">Reason</label>
        <input
          type="text"
          placeholder="e.g. Lost card reported by customer"
          className={`mt-1 ${inputBaseClass} ${hasError ? 'border-danger' : 'border-border hover:border-border-hover focus:border-ink'}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        {hasError ? (
          <p className="mt-1 text-xs text-danger">A reason is required</p>
        ) : (
          <p className="mt-1 text-xs text-ink-faint">
            Shown on the account so the next agent knows why it is suspended.
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Suspend account
        </Button>
      </div>
    </Modal>
  )
}
