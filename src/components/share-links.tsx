import { useEffect, useState, type ReactElement } from 'react'
import toast from 'react-hot-toast'
import { CheckIcon, LinkIcon, ShareIcon } from './icons'
import { FacebookIcon, LinkedInIcon, TelegramIcon, WhatsAppIcon, XIcon } from './social-icons'

interface Target {
  name: string
  href: string
  Icon: (props: { size?: number }) => ReactElement
}

const SHARE_TEXT = 'TodoHub - a local-first todo list with sub-lists'

/**
 * The website URL to share - the site root, not whichever page the visitor
 * happens to be on, so a LinkedIn post or WhatsApp message always points at
 * TodoHub itself.
 *
 * Prefers the canonical link the build emits (absolute and deployment-correct);
 * falls back to the origin serving the app.
 */
function resolveShareUrl(): string {
  if (typeof document === 'undefined') return ''
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
  if (canonical && /^https?:\/\//.test(canonical)) return canonical
  return `${window.location.origin}/`
}

function buildTargets(url: string, text: string): Target[] {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text)

  return [
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon },
    { name: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsAppIcon },
    { name: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}`, Icon: TelegramIcon },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: LinkedInIcon,
    },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
  ]
}

interface ShareLinksProps {
  label?: string
  className?: string
}

/**
 * Site-wide share block. Each button opens that platform's share composer
 * pre-filled with the TodoHub URL, plus copy-link and the native share sheet
 * where the device supports it.
 */
export function ShareLinks({
  label = 'Enjoying TodoHub? Pass it on.',
  className = '',
}: ShareLinksProps) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [canShareNatively, setCanShareNatively] = useState(false)

  useEffect(() => {
    setUrl(resolveShareUrl())
    setCanShareNatively(
      typeof navigator.canShare === 'function' && typeof navigator.share === 'function',
    )
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(resolveShareUrl())
      setCopied(true)
      toast.success('Link copied.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy the link.')
    }
  }

  const shareNatively = async () => {
    try {
      await navigator.share({ title: 'TodoHub', text: SHARE_TEXT, url: resolveShareUrl() })
    } catch {
      /* dismissed by the user - nothing to report */
    }
  }

  const targets = buildTargets(url, SHARE_TEXT)

  return (
    <div className={`share ${className}`.trim()}>
      <span className="share__label">{label}</span>

      <div className="share__row">
        {targets.map(({ name, href, Icon }) => (
          <a
            key={name}
            className="share__btn"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share TodoHub on ${name}`}
            title={`Share on ${name}`}
          >
            <Icon size={17} />
            <span className="share__btn-label">{name}</span>
          </a>
        ))}

        <button
          type="button"
          className="share__btn"
          onClick={copyLink}
          aria-label="Copy a link to TodoHub"
          title="Copy link"
        >
          {copied ? <CheckIcon size={17} /> : <LinkIcon size={17} />}
          <span className="share__btn-label">{copied ? 'Copied' : 'Copy link'}</span>
        </button>

        {canShareNatively ? (
          <button
            type="button"
            className="share__btn"
            onClick={shareNatively}
            aria-label="Share TodoHub using your device"
            title="Share..."
          >
            <ShareIcon size={17} />
            <span className="share__btn-label">Share</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
