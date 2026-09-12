import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BrandMark, MoonIcon, SunIcon } from './icons'
import { useTheme } from './theme'
import { IconButton } from './ui'

/** Page chrome shared by every route. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <div className="app-bg" aria-hidden="true" />
      <Header />
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = theme === 'dark'

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="container header__inner">
        <NavLink to="/" className="brand" aria-label="TodoHub, back to your list">
          <span className="brand__mark">
            <BrandMark />
          </span>
          TodoHub
        </NavLink>

        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className="nav__link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav__link">
            About
          </NavLink>
          <IconButton
            label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
            aria-pressed={isDark}
          >
            {/* keyed so the icon replays its entrance animation on each swap */}
            <span className="theme-icon" key={theme}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </span>
          </IconButton>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>TodoHub</span>
        <span aria-hidden="true">&middot;</span>
        <span>Your list never leaves this device</span>
        <span className="spacer" />
        <span className="row">
          <span>Add with</span>
          <kbd className="kbd">Enter</kbd>
        </span>
      </div>
    </footer>
  )
}
