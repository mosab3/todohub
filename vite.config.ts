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
 * Port for the dev/preview server. Honours PORT (the portal contract) and falls
 * back to 3000.
 */
function devPort(): number {
  const parsed = Number(process.env.PORT)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3000
}

/**
 * Hostnames allowed to reach the dev/preview server.
 *
 * Vite rejects unknown Host headers to prevent DNS rebinding, so any mDNS name
 * used from another device has to be listed explicitly. A leading dot matches
 * the domain and its subdomains.
 *
 * The values are read from the environment on purpose: the real LAN name lives
 * in `.env.local`, which is gitignored, so it never enters this tracked file.
 */
function resolveAllowedHosts(raw: string | undefined): string[] {
  const hosts = (raw ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return hosts.length > 0 ? hosts : ['localhost', '.localhost']
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
          // Structured data identifiers must be absolute, so drop the block
          // rather than emit invalid @id/url values.
          out = out.replace(
            /[ \t]*<script[^>]*data-requires-site-url[^>]*>[\s\S]*?<\/script>\r?\n/g,
            '',
          )
        }

        return out
      },
    },
  }
}

/** Client-side routes that exist, used for the sitemap. */
const ROUTES = ['/', '/about']

/**
 * Emits `sitemap.xml` and `robots.txt` at build time.
 *
 * Both require absolute URLs, so nothing is written when the site URL cannot be
 * resolved - a sitemap full of relative paths is worse than no sitemap. Netlify
 * exposes `URL` during builds, so this normally just works there.
 */
function seoFiles({ siteUrl }: { siteUrl: string }): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      if (!siteUrl) {
        this.warn('No site URL resolved (VITE_SITE_URL / Netlify URL); skipping sitemap.xml and robots.txt')
        return
      }

      // Google ignores changefreq/priority, so only lastmod is emitted.
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = ROUTES.map((route) => {
        const loc = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
      }).join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Unprefixed too: DEV_ALLOWED_HOSTS lives in .env.local, which is gitignored,
  // so the private LAN name stays out of the repository.
  const localEnv = loadEnv(mode, process.cwd(), '')
  const pubId = process.env.VITE_ADSENSE_PUB ?? env.VITE_ADSENSE_PUB
  const siteUrl = resolveSiteUrl()
  const allowedHosts = resolveAllowedHosts(
    process.env.DEV_ALLOWED_HOSTS ?? localEnv.DEV_ALLOWED_HOSTS,
  )

  return {
    plugins: [react(), headMeta({ pubId, siteUrl }), seoFiles({ siteUrl })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: devPort(),
      // Bind every interface so the app is reachable from other devices on the
      // network, not just from inside the Gateway host.
      host: true,
      allowedHosts,
    },
    preview: {
      port: devPort(),
      host: true,
      allowedHosts,
    },
  }
})
