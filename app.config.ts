import { defineConfig } from "@solidjs/start/config";
import tailwindcss from '@tailwindcss/vite'
import path from "node:path";

export default defineConfig({
  ssr: true,
  vite: {
    // @ts-expect-error - Tailwind CSS Vite plugin is not typed
    plugins: [tailwindcss()],
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
});
