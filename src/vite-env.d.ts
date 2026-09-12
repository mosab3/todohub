/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_PUB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
