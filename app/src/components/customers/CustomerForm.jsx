import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import CustomerFormFields, { buildInitialState, computeErrors } from './CustomerFormFields'

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

      <CustomerFormFields
        fields={fields}
        touched={touched}
        errors={errors}
        onFieldChange={handleFieldChange}
        onBlur={handleBlur}
      />
    </Drawer>
  )
}
