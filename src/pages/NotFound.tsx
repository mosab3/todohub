import { Link } from 'react-router-dom'
import { AlertTriangleIcon } from '@/components/icons'

/**
 * Client-side counterpart to public/404.html.
 *
 * Deliberately signalled as an error: warning colour, a broken-state icon
 * (never the brand checkmark, which reads as success), and "404" as the largest
 * element on the page. Recovery actions come before any secondary information.
 */
export default function NotFound() {
  return (
    <div className="error">
      <span className="error__badge" aria-hidden="true">
        <AlertTriangleIcon size={26} />
      </span>

      <p className="error__code" aria-hidden="true">
        404
      </p>

      <h1 className="error__title">Page not found</h1>

      <p className="error__body">
        The link you followed is broken, or the address was mistyped. Nothing was lost &mdash; your
        tasks are stored in this browser, not on a server.
      </p>

      <div className="error__actions">
        <Link to="/" className="btn btn--primary">
          Back to your list
        </Link>
        <Link to="/about" className="btn btn--ghost">
          About TodoHub
        </Link>
      </div>

      <p className="error__hint">
        Receiving a shared list? Scan its QR code from your list.
      </p>
    </div>
  )
}
