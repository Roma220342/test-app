import { PauseCircle, PlayCircle } from 'lucide-react'

// Customer accounts only ever move between "usable" and "not usable" — there
// is no review step like partners have, so this is a straight toggle.
export function customerStatusAction(status) {
  if (status === 'Active') {
    return { label: 'Suspend', next: 'Suspended', icon: PauseCircle }
  }
  return { label: 'Reactivate', next: 'Active', icon: PlayCircle }
}
