import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { standardSecurityHeaders } from "./src/shared/security/security-headers";

export default defineConfig(() => ({
  plugins: [
    solidStart({
      serialization: { mode: "json" },
    }),
    nitro({
      routeRules: {
        "/**": {
          headers: standardSecurityHeaders,
        },
      },
    }),
  ],
  nitro: {
    preset: "bun",
  },
}));
