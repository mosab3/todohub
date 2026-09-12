import { type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@/components/icons'
import { useReveal } from '@/hooks/useReveal'

export default function About() {
  useReveal()

  return (
    <>
      <section className="hero">
        <span className="hero__eyebrow">
          <span className="hero__dot" />
          About
        </span>
        <h1 className="hero__title">
          A todo list that <em>gets out of the way</em>.
        </h1>
        <p className="hero__lede">
          TodoHub does one thing: it keeps a list. No sign-up, no server, no telemetry, no
          notification nagging you at 2am about a task you already finished.
        </p>
      </section>

      <div
        className="card card--pad about-block reveal"
        style={{ '--reveal-delay': 60 } as CSSProperties}
      >
        <div className="prose">
          <h2 className="card__title">Why it exists</h2>
          <p>
            Task apps tend to grow into project-management suites. TodoHub stayed small on purpose.
            The list is stored in your browser&apos;s local storage, which means it is fast, works
            without a connection, and never leaves the device unless you explicitly share it.
          </p>
          <p>
            Big tasks can hold their own sub-list of steps, so a vague intention becomes a short,
            obvious sequence. Move a whole list to another device with a QR code - no account to
            create, no cloud to trust.
          </p>
        </div>
      </div>

      <div className="card card--pad reveal" style={{ '--reveal-delay': 140 } as CSSProperties}>
        <h2 className="card__title">Under the hood</h2>
        <div className="dl">
          <div className="dl__row">
            <span className="dl__key">Storage</span>
            <span className="dl__val">Browser localStorage - this device only</span>
          </div>
          <div className="dl__row">
            <span className="dl__key">Stack</span>
            <span className="dl__val">React 18 &middot; Vite &middot; TypeScript</span>
          </div>
          <div className="dl__row">
            <span className="dl__key">Sharing</span>
            <span className="dl__val">QR code, device to device</span>
          </div>
          <div className="dl__row">
            <span className="dl__key">Hosting</span>
            <span className="dl__val">Static build on Netlify</span>
          </div>
        </div>

        <div className="taglist about-tags">
          <span className="tag">No account</span>
          <span className="tag">Offline-first</span>
          <span className="tag">Sub-lists</span>
          <span className="tag">Dark mode</span>
          <span className="tag">RTL ready</span>
          <span className="tag">Keyboard friendly</span>
        </div>

        <div className="about-actions">
          <Link to="/" className="btn btn--ghost">
            <ArrowLeftIcon size={18} />
            Back to the list
          </Link>
        </div>
      </div>
    </>
  )
}
