import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { defineConfig } from '@solidjs/start/config'
import tailwindcss from '@tailwindcss/vite'

type NextFunction = () => void
type DevServerWithMiddlewares = {
  middlewares: {
    use: (
      handler: (request: IncomingMessage, response: ServerResponse, next: NextFunction) => void,
    ) => void
  }
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

const securityHeadersPlugin = () => ({
  name: 'liquid-security-headers',
  configureServer(server: DevServerWithMiddlewares) {
    server.middlewares.use((_request, response, next) => {
      for (const [header, value] of Object.entries(securityHeaders)) {
        response.setHeader(header, value)
      }
      next()
    })
  },
  configurePreviewServer(server: DevServerWithMiddlewares) {
    server.middlewares.use((_request, response, next) => {
      for (const [header, value] of Object.entries(securityHeaders)) {
        response.setHeader(header, value)
      }
      next()
    })
  },
})

export default defineConfig({
  ssr: true,
  vite: {
    // @ts-expect-error - Tailwind CSS Vite plugin is not typed
    plugins: [tailwindcss(), securityHeadersPlugin()],
    build: {
      chunkSizeWarningLimit: 1000,
    },
    logLevel: 'warn',
  },
  server: {
    preset: 'node-server',
  },
  alias: {
    '~': path.resolve(process.cwd(), 'src'),
  },
})
