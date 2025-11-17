import { defineConfig } from "@solidjs/start/config";
import tailwindcss from '@tailwindcss/vite'
import path from "node:path";

export default defineConfig({
  ssr: true,

  vite: {
    // @ts-expect-error - Tailwind CSS Vite plugin is not typed
    plugins: [tailwindcss()],
    build: {
      // Réduire les warnings pour les gros fichiers
      chunkSizeWarningLimit: 1000,
    },
    // Ignorer les warnings pour les fichiers statiques dans public/
    logLevel: 'warn',
  },
  alias: {
    '~': path.resolve(process.cwd(), 'src'),
  },
});
