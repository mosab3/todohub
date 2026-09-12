import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, InboxIcon, QrIcon, ScanIcon } from './icons'
import { normalizeTodos, type Todo } from './todos'
import { Button, Modal } from './ui'

type Mode = 'choose' | 'send' | 'receive'

/**
 * A QR symbol tops out at 2953 bytes at error-correction level L. Sub-lists
 * inflate the payload quickly, so the send view refuses to render a code that
 * would be unreadable instead of showing a QR that silently never scans.
 */
const QR_BYTE_LIMIT = 2900

interface ShareModalProps {
  open: boolean
  onClose: () => void
  todos: Todo[]
  onImport: (todos: Todo[]) => void
}

/**
 * Moves a list between devices with a QR code.
 *
 * Only `text`, `checked` and nested `subtasks` travel in the payload: internal
 * ids would bloat a capacity-limited symbol for no benefit, since the receiver
 * normalizes whatever it reads.
 */
export function ShareModal({ open, onClose, todos, onImport }: ShareModalProps) {
  const [mode, setMode] = useState<Mode>('choose')
  const [scanned, setScanned] = useState<Todo[]>([])
  // Rate-limits the "not a TodoHub code" toast - the camera decodes the same
  // stranger's QR code many times per second.
  const lastRejectAt = useRef(0)

  // Reset the flow whenever the dialog closes.
  useEffect(() => {
    if (!open) {
      setMode('choose')
      setScanned([])
    }
  }, [open])

  const payload = JSON.stringify(
    todos.map(({ text, checked, subtasks }) => ({
      text,
      checked,
      subtasks: subtasks.map(({ text: subText, checked: subChecked }) => ({
        text: subText,
        checked: subChecked,
      })),
    })),
  )
  const payloadBytes = new TextEncoder().encode(payload).length
  const tooBig = payloadBytes > QR_BYTE_LIMIT

  const newOnes = scanned.filter((item) => !todos.some((existing) => existing.text === item.text))
  const duplicates = scanned.length - newOnes.length
  const stepTotal = todos.reduce((sum, todo) => sum + todo.subtasks.length, 0)

  const rejectCode = () => {
    const now = Date.now()
    if (now - lastRejectAt.current < 3000) return
    lastRejectAt.current = now
    toast.error("That code isn't a TodoHub list. Try another one.")
  }

  const handleScan = (codes: { rawValue: string }[]) => {
    if (scanned.length > 0) return // already read one code
    const raw = codes[0]?.rawValue
    if (!raw) return

    let parsed: Todo[] = []
    try {
      parsed = normalizeTodos(JSON.parse(raw))
    } catch {
      rejectCode()
      return
    }

    // Keep the camera running: a stray QR code should not end the flow.
    if (parsed.length === 0) {
      rejectCode()
      return
    }

    setScanned(parsed)
  }

  const handleImport = () => {
    if (newOnes.length === 0) return
    onImport(newOnes)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share list"
      footer={
        mode === 'receive' && scanned.length > 0 ? (
          <>
            <span className="modal__note">
              {newOnes.length} new
              {duplicates > 0 ? `, ${duplicates} already on your list` : ''}
            </span>
            <span className="spacer" />
            <Button variant="ghost" onClick={() => setScanned([])}>
              Scan again
            </Button>
            <Button onClick={handleImport} disabled={newOnes.length === 0}>
              Add {newOnes.length > 0 ? newOnes.length : ''} to list
            </Button>
          </>
        ) : (
          <span className="modal__note">
            Nothing is uploaded - the list travels inside the QR code itself.
          </span>
        )
      }
    >
      {mode === 'choose' ? (
        <div className="choice">
          <button type="button" className="choice__card" onClick={() => setMode('send')}>
            <span className="choice__icon">
              <QrIcon size={22} />
            </span>
            <span className="stack">
              <span className="choice__title">Send this list</span>
              <span className="choice__desc">
                {todos.length > 0
                  ? `Show a QR code containing ${todos.length} ${todos.length === 1 ? 'task' : 'tasks'}${
                      stepTotal > 0 ? ` and ${stepTotal} steps` : ''
                    }.`
                  : 'Your list is empty - add a task first.'}
              </span>
            </span>
          </button>

          <button type="button" className="choice__card" onClick={() => setMode('receive')}>
            <span className="choice__icon">
              <ScanIcon size={22} />
            </span>
            <span className="stack">
              <span className="choice__title">Receive a list</span>
              <span className="choice__desc">Scan a code from another device with your camera.</span>
            </span>
          </button>
        </div>
      ) : null}

      {mode === 'send' ? (
        <div className="qr">
          {tooBig ? (
            <div className="notice notice--warn">
              <strong>This list is too large for one QR code.</strong>
              <p>
                The payload is {payloadBytes} bytes and a QR symbol carries roughly {QR_BYTE_LIMIT} at
                this error-correction level. Complete or delete a few tasks, or share in smaller
                batches.
              </p>
            </div>
          ) : (
            <div className="qr__frame">
              <QRCodeCanvas value={payload} size={216} level="L" marginSize={1} />
            </div>
          )}
          <p className="modal__note">
            Open TodoHub on the other device and choose Receive a list.
          </p>
          <Button variant="ghost" onClick={() => setMode('choose')}>
            <ArrowLeftIcon size={18} /> Back
          </Button>
        </div>
      ) : null}

      {mode === 'receive' && scanned.length === 0 ? (
        <div>
          <div className="scanner">
            <Scanner
              onScan={handleScan}
              onError={(error) => {
                const name = (error as { name?: string } | null)?.name
                if (name === 'NotAllowedError') {
                  toast.error('Camera permission was denied.')
                } else if (name === 'NotFoundError') {
                  toast.error('No camera found on this device.')
                } else {
                  toast.error('Could not start the camera.')
                }
                setMode('choose')
              }}
              formats={['qr_code']}
            />
          </div>
          <p className="scanner__hint">
            Point the camera at the sender&apos;s QR code. Camera access is required, and this page
            must be served over HTTPS.
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setMode('choose')}>
              <ArrowLeftIcon size={18} /> Back
            </Button>
          </div>
        </div>
      ) : null}

      {mode === 'receive' && scanned.length > 0 ? (
        <div className="stack" style={{ gap: '1rem' }}>
          <div className="shared">
            {scanned.map((todo, index) => {
              const isDuplicate = todos.some((existing) => existing.text === todo.text)
              return (
                <div
                  className="shared__row"
                  key={todo.id}
                  style={{ '--i': index } as CSSProperties}
                >
                  <InboxIcon size={16} />
                  <span className="shared__text" dir="auto">
                    {todo.text}
                  </span>
                  {todo.subtasks.length > 0 ? (
                    <span className="badge badge--steps">{todo.subtasks.length} steps</span>
                  ) : null}
                  <span className={`badge ${isDuplicate ? 'badge--dup' : 'badge--new'}`}>
                    {isDuplicate ? 'Already added' : 'New'}
                  </span>
                </div>
              )
            })}
          </div>
          {newOnes.length === 0 ? (
            <p className="modal__note">Everything in this code is already on your list.</p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}
