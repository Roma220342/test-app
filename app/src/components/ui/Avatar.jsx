import { initialsFor } from '../../utils/avatarColor'

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
}

export default function Avatar({ name, logo, size = 'md', className = '' }) {
  const sizeClass = SIZES[size] || SIZES.md

  if (logo) {
    return (
      <img
        src={logo}
        alt={`${name} logo`}
        className={`${sizeClass} shrink-0 rounded-lg object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-lg bg-surface-sunken font-semibold text-ink-soft ${className}`}
      aria-label={`${name} avatar`}
    >
      {initialsFor(name)}
    </div>
  )
}
