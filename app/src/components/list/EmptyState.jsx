import { Inbox, SearchX, UserX } from 'lucide-react'
import Button from '../ui/Button'

const CONTENT = {
  'no-partners': {
    icon: Inbox,
    heading: 'No partners yet',
    description: 'Get started by adding your first partner to the network.',
    buttonLabel: 'Add your first partner',
    buttonVariant: 'primary',
  },
  'no-results': {
    icon: SearchX,
    heading: 'No partners match your filters',
    description: 'Try adjusting your search or filters to find what you’re looking for.',
    buttonLabel: 'Clear filters',
    buttonVariant: 'secondary',
  },
  'no-customers-found': {
    icon: UserX,
    heading: 'No customers match that search',
    description: 'Double-check the spelling, or try a different name, phone, email, or card number.',
  },
}

export default function EmptyState({ variant, onAction }) {
  const content = CONTENT[variant] || CONTENT['no-results']
  const Icon = content.icon

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 text-center">
      <Icon size={44} className="text-ink-faint" />
      <h3 className="mt-4 text-base font-semibold text-ink">{content.heading}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-faint">{content.description}</p>
      {content.buttonLabel && (
        <Button variant={content.buttonVariant} onClick={onAction} className="mt-5">
          {content.buttonLabel}
        </Button>
      )}
    </div>
  )
}
