import type { ReactNode } from 'react'

/**
 * Hand-rolled icon set on a 24x24 grid, stroked with `currentColor`.
 * Replaces the bootstrap-icons webfont (which shipped ~600 kB of font files
 * and a 100 kB stylesheet to render five glyphs).
 */

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

interface BaseProps extends IconProps {
  children: ReactNode
}

function Base({ size = 20, className, strokeWidth = 1.75, children }: BaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Base strokeWidth={2.5} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Base>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 6h18M8 6V4.5A.5.5 0 0 1 8.5 4h7a.5.5 0 0 1 .5.5V6" />
      <path d="M19 6l-1 13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5L5 6" />
      <path d="M10 11v5M14 11v5" />
    </Base>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </Base>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12v7.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V12" />
      <path d="M12 3v13" />
      <path d="m7.5 7.5 4.5-4.5 4.5 4.5" />
    </Base>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Base>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </Base>
  )
}

export function QrIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3v3h-3z" />
    </Base>
  )
}

export function ScanIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M4 12h16" />
    </Base>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Base>
  )
}

export function InboxIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 13h4l1 3h6l1-3h4" />
      <path d="M5.5 5h13l1.5 8v5.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V13L5.5 5Z" />
    </Base>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6.4 6.4l2.8 2.8M14.8 14.8l2.8 2.8M17.6 6.4l-2.8 2.8M9.2 14.8l-2.8 2.8" />
    </Base>
  )
}

/** Brand mark - filled, so it takes the accent gradient from CSS. */
export function BrandMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  )
}

/** Decorative illustration for the empty state. */
export function EmptyArt({ size = 84 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className="empty__art"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="14"
        y="18"
        width="60"
        height="60"
        rx="14"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <rect
        x="24"
        y="28"
        width="40"
        height="40"
        rx="10"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M36 48.5 45 57l17-18"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="18" cy="74" r="2.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
