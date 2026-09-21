import { AlertTriangle, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function DeleteConfirmModal({
  open,
  count,
  names,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Delete',
  confirmIcon: ConfirmIcon = Trash2,
}) {
  const isSingle = count === 1

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft">
        <AlertTriangle className="text-danger" size={22} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-ink">
        {title || `Delete ${count} partner${isSingle ? '' : 's'}?`}
      </h2>

      <p className="mt-2 text-sm text-ink-soft">
        {description ||
          (isSingle
            ? `"${names[0]}" will be permanently removed. This can't be undone.`
            : `These ${count} partners will be permanently removed. This can't be undone.`)}
      </p>

      {!isSingle && count <= 5 && (
        <ul className="mt-2 list-disc pl-5 text-sm text-ink-soft">
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="dangerSolid" onClick={onConfirm}>
          <ConfirmIcon size={16} />
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
