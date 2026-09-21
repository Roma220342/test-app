import { PlayCircle, PauseCircle, CheckCircle2 } from 'lucide-react'

// Single source of truth for the status-change action shown on a partner —
// used by both the card's "⋮" menu and the detail panel's primary button,
// so the two can never drift out of sync.
export function statusAction(status) {
  switch (status) {
    case 'Active':
      return { label: 'Deactivate', next: 'Inactive', icon: PauseCircle }
    case 'Pending Review':
      return { label: 'Approve', next: 'Active', icon: CheckCircle2 }
    case 'Inactive':
    case 'Suspended':
    default:
      return { label: 'Activate', next: 'Active', icon: PlayCircle }
  }
}
