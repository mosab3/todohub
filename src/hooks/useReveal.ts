import { useEffect } from 'react'

/**
 * Reveals `.reveal` elements as they scroll into view.
 *
 * Elements start hidden via CSS, so this must be resilient: if the browser
 * lacks IntersectionObserver, or the user prefers reduced motion, everything is
 * revealed immediately rather than left invisible.
 */
export function useReveal(): void {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (nodes.length === 0) return

    const revealAll = () => nodes.forEach((node) => node.setAttribute('data-reveal', 'in'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-reveal', 'in')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => {
      // Anything already on screen skips the observer round-trip.
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight) node.setAttribute('data-reveal', 'in')
      else observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])
}
