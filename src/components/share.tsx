import { useEffect, useRef, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, InboxIcon, QrIcon, ScanIcon } from './icons'
import { normalizeTodos, type Todo } from './todos'
import { Button, Modal } from './ui'

type Mode = 'choose' | 'send' | 'receive'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  todos: Todo[]
  onImport: (todos: Todo[]) => void
}

/**
 * Moves a list between devices with a QR code.
 *
 * Only `text` and `checked` travel in the payload: a QR symbol has limited
 * capacity, and internal ids would bloat it for no benefit since the receiver
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

  const payload = JSON.stringify(todos.map(({ text, checked }) => ({ text, checked })))
  const newOnes = scanned.filter((item) => !todos.some((existing) => existing.text === item.text))
  const duplicates = scanned.length - newOnes.length

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
                  ? `Show a QR code containing all ${todos.length} tasks.`
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
          <div className="qr__frame">
            <QRCodeCanvas value={payload} size={216} level="L" marginSize={1} />
          </div>
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
            Point the camera at the sender's QR code. Camera access is required, and this
            page must be served over HTTPS.
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
            {scanned.map((todo) => {
              const isDuplicate = todos.some((existing) => existing.text === todo.text)
              return (
                <div className="shared__row" key={todo.id}>
                  <InboxIcon size={16} />
                  <span className="shared__text" dir="auto">
                    {todo.text}
                  </span>
                  <span className={`badge ${isDuplicate ? 'badge--dup' : 'badge--new'}`}>
                    {isDuplicate ? 'Already added' : 'New'}
                  </span>
                </div>
              )
            })}
          </div>
          {newOnes.length === 0 ? (
            <p className="modal__note">
              Everything in this code is already on your list.
            </p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}
