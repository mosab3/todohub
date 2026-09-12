import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * Injects the AdSense publisher ID into `index.html`.
 *
 * When `VITE_ADSENSE_PUB` is unset the loader script is removed instead of
 * shipping a literal `ca-pub-%VITE_ADSENSE_PUB%` to production. Runs as a
 * `pre` transform, so Vite's own HTML env substitution never sees the
 * placeholder and cannot warn about it.
 */
function adsenseLoader(pubId?: string): Plugin {
  return {
    name: 'adsense-loader',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (pubId) {
          return html.replace('%VITE_ADSENSE_PUB%', pubId)
        }
        return html.replace(
          /[ \t]*<script[^>]*googlesyndication\.com[\s\S]*?<\/script>\n?/,
          '',
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const pubId =
    process.env.VITE_ADSENSE_PUB ??
    loadEnv(mode, process.cwd(), 'VITE_').VITE_ADSENSE_PUB

  return {
    plugins: [react(), adsenseLoader(pubId)],
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
