// Buckets the config.bmoAmount string ("10L", "No limit", …) into a small
// set of filterable ranges. Timing (Immediate/Delayed) is a separate field
// and filtered independently — see config.bmoTiming.
export const BMO_BUCKETS = ['No limit', 'Under 5L', '5-10L', '10L+']

export function bmoBucket(bmoString) {
  if (!bmoString) return null
  const normalized = bmoString.trim().toLowerCase()
  if (normalized.startsWith('no limit')) return 'No limit'

  const match = normalized.match(/(\d+(\.\d+)?)/)
  if (!match) return null

  const liters = parseFloat(match[1])
  if (liters < 5) return 'Under 5L'
  if (liters <= 10) return '5-10L'
  return '10L+'
}
