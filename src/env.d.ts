/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JWT_SECRET: string
  readonly ADMIN_USER: string
  readonly ADMIN_PASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
