/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  // Build-time short git hash, defined via Vite's `define` in astro.config.ts.
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
  var __BUILD_HASH__: string
}

export {}
