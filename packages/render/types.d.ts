/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SSR: boolean
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  $zelpis: {
    hydrateData: {
      dsl?: Record<string, unknown>
      [key: string]: unknown
    }
  }
}
