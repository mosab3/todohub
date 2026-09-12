import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * Absolute base URL used by the canonical link and the og:url / og:image tags,
 * which crawlers require to be absolute for link previews to work.
 *
 * Netlify exposes `URL` and `DEPLOY_PRIME_URL` during builds, so a Netlify
 * deploy resolves this with no configuration; `VITE_SITE_URL` overrides both for
 * other hosts or to force a custom domain.
 */
function resolveSiteUrl(): string {
  const raw =
    process.env.VITE_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || ''
  return raw.trim().replace(/\/+$/, '')
}

/**
 * Rewrites build-time placeholders in index.html:
 *
 * - `%VITE_ADSENSE_PUB%` becomes the publisher ID, or the whole loader script is
 *   removed so a literal `ca-pub-%VITE_ADSENSE_PUB%` never reaches production.
 * - `%SITE_URL%` becomes the absolute base URL. When it cannot be resolved,
 *   tags that are only valid as absolute URLs (canonical, og:url) are dropped,
 *   and og:image falls back to a relative path, which crawlers resolve against
 *   the page URL.
 *
 * Runs as a `pre` transform, so Vite's own HTML env substitution never sees
 * these placeholders and cannot warn about them.
 */
function headMeta({ pubId, siteUrl }: { pubId?: string; siteUrl: string }): Plugin {
  return {
    name: 'head-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let out = html

        // AdSense -----------------------------------------------------------------
        if (pubId) {
          out = out.replace('%VITE_ADSENSE_PUB%', pubId)
        } else {
          out = out.replace(
            /[ \t]*<script[^>]*googlesyndication\.com[\s\S]*?<\/script>\n?/,
            '',
          )
        }

        // Site URL ----------------------------------------------------------------
        if (siteUrl) {
          out = out.replace(/%SITE_URL%/g, siteUrl)
        } else {
          out = out.replace(/%SITE_URL%/g, '')
          // An empty og:url or canonical is worse than none at all.
          out = out.replace(
            /^[ \t]*<[^>]*(?:property="og:url"|rel="canonical")[^>]*>[ \t]*\r?\n/gm,
            '',
          )
        }

        return out
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const pubId = process.env.VITE_ADSENSE_PUB ?? env.VITE_ADSENSE_PUB

  return {
    plugins: [react(), headMeta({ pubId, siteUrl: resolveSiteUrl() })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
  }
})
