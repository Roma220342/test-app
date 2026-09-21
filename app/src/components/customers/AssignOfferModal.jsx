import { useEffect, useState } from 'react'
import { Ticket } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import { AVAILABLE_OFFERS } from '../../data/mockCustomers'

const OFFER_OPTIONS = AVAILABLE_OFFERS.map((name) => ({ value: name, label: name }))

export default function AssignOfferModal({ open, customer, onClose, onConfirm }) {
  const [offerName, setOfferName] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setOfferName('')
    setTouched(false)
  }, [open, customer])

  if (!open || !customer) return null

  const hasError = touched && !offerName

  const handleSubmit = () => {
    setTouched(true)
    if (!offerName) return
    onConfirm({ name: offerName })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
        <Ticket className="text-ink-soft" size={22} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-ink">Assign an offer</h2>
      <p className="mt-1 text-sm text-ink-soft">
        The offer is added to {customer.name}&apos;s account immediately.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium text-ink">Offer</label>
        <Dropdown
          label="Offer"
          className="mt-1"
          value={offerName}
          onChange={setOfferName}
          onBlur={() => setTouched(true)}
          options={OFFER_OPTIONS}
          placeholder="Select an offer…"
          hasError={hasError}
          triggerBg="bg-surface"
          triggerBorder="border-border"
        />
        {hasError && <p className="mt-1 text-xs text-danger">Please select an offer</p>}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Assign offer
        </Button>
      </div>
    </Modal>
  )
}
