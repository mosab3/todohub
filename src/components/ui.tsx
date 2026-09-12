import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Toaster } from 'react-hot-toast'
import { CloseIcon, EmptyArt } from './icons'

/* Button ------------------------------------------------------------------ */

type Variant = 'primary' | 'ghost' | 'quiet' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...rest} />
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls need an accessible name. */
  label: string
  danger?: boolean
}

export function IconButton({ label, danger = false, className = '', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={`icon-btn ${danger ? 'icon-btn--danger' : ''} ${className}`.trim()}
      aria-label={label}
      title={label}
      {...rest}
    />
  )
}

/* Modal ------------------------------------------------------------------- */

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Built on the native <dialog> element, which gives us focus trapping, inert
 * background content, Escape handling and correct stacking for free.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Route the browser's native Escape through React state so `open` stays true
  // to the rendered UI.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-title"
      onClick={(event) => {
        // Clicks that land on the dialog itself missed the card.
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="modal__card">
        <div className="modal__head">
          <h2 className="modal__title" id="modal-title">
            {title}
          </h2>
          <span className="spacer" />
          <IconButton label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__foot">{footer}</div> : null}
      </div>
    </dialog>
  )
}

/* Progress ---------------------------------------------------------------- */

/** Eases a number toward its target so the readout counts instead of jumping. */
function useCountUp(target: number, duration = 650): number {
  const [value, setValue] = useState(0)
  const currentRef = useRef(0)

  useEffect(() => {
    const from = currentRef.current
    if (from === target) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentRef.current = target
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const next = Math.round(from + (target - from) * eased)
      currentRef.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const displayed = useCountUp(pct)
  // Starts at 0 so the ring sweeps up to its value on first paint.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const complete = total > 0 && done === total

  let label = 'Nothing on the list yet'
  let sub = 'Add your first task to get going.'

  if (total > 0) {
    label = `${done} of ${total} done`
    if (complete) {
      sub = 'Everything is done. Enjoy the quiet.'
    } else if (done === 0) {
      sub = 'All clear ahead.'
    } else {
      sub = `${total - done} left to go.`
    }
  }

  return (
    <div className="card progress">
      <div
        className="progress__ring"
        style={{ '--pct': mounted ? pct : 0 } as CSSProperties}
        data-complete={complete}
        role="img"
        aria-label={`${pct}% of tasks complete`}
      >
        <span className="progress__pct">{displayed}%</span>
      </div>
      <div className="progress__meta">
        <div className="progress__label">{label}</div>
        <div className="progress__sub">{sub}</div>
      </div>
    </div>
  )
}

/* Empty state ------------------------------------------------------------- */

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty">
      <EmptyArt />
      <p className="empty__title">{title}</p>
      <p className="empty__body">{body}</p>
    </div>
  )
}

/* Toasts ------------------------------------------------------------------ */

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{ className: 'toast', duration: 2600 }}
      containerStyle={{ bottom: 24 }}
    />
  )
}
