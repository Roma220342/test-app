import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import PartnerFormFields, { buildInitialState, computeErrors } from './PartnerFormFields'

export default function PartnerForm({ open, existingPartners, onClose, onSubmit }) {
  const [fields, setFields] = useState(() => buildInitialState('create'))
  const [touched, setTouched] = useState({})
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false)

  useEffect(() => {
    if (!open) return
    setFields(buildInitialState('create'))
    setTouched({})
    setShowDuplicateBanner(false)
  }, [open])

  if (!open) return null

  const errors = computeErrors(fields, existingPartners, null)

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

    const submitErrors = computeErrors(fields, existingPartners, null)

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

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="New Partner"
      footer={
        <div className="flex items-center justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Partner
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

      <PartnerFormFields
        fields={fields}
        touched={touched}
        errors={errors}
        onFieldChange={handleFieldChange}
        onConfigChange={handleConfigChange}
        onBlur={handleBlur}
      />
    </Drawer>
  )
}
