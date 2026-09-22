const VARIANTS = {
  // The one primary CTA per screen — flat fill, no border or shadow.
  // Hover darkens the fill: on a saturated red nothing else reads.
  primary:
    'rounded-lg bg-accent text-white hover:bg-accent-hover active:bg-accent-hover disabled:bg-ink-faint disabled:cursor-not-allowed',
  // White with a resting outline, matching the Filter control so the two read
  // as the same class of button. Hover steps both the fill and the outline,
  // the same pair the partner card uses.
  secondary:
    'rounded-lg border border-border bg-surface text-ink hover:border-border-hover hover:bg-surface-hover active:border-border-hover active:bg-surface-hover disabled:text-ink-faint disabled:cursor-not-allowed',
  ghost:
    'rounded-lg bg-transparent text-ink-soft hover:bg-surface-hover active:bg-surface-hover disabled:text-ink-faint disabled:cursor-not-allowed',
  // Destructive actions only — a muted, desaturated red, outline-only so it
  // never reads as "the" primary action next to the real (accent-red) one.
  // The border here is semantic (marks the action as destructive), not a
  // decorative resting border, so it's kept.
  danger:
    'rounded-lg bg-transparent text-danger border border-danger hover:bg-danger-soft active:bg-danger-soft disabled:text-ink-faint disabled:border-border disabled:cursor-not-allowed',
  // Same muted red, filled — for a confirm dialog where Delete genuinely
  // is the dialog's own primary action (no competing CTA alongside it).
  dangerSolid:
    'rounded-lg bg-danger text-white hover:bg-danger-hover active:bg-danger-hover disabled:bg-ink-faint disabled:cursor-not-allowed',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&>svg:first-child]:-ml-1 [&>svg:last-child]:-mr-1 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
