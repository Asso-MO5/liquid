import { randomBytes } from "node:crypto";
import { createHandler, StartServer } from "@solidjs/start/server";
import { createContentSecurityPolicy } from "~/shared/security/security-headers";

export default createHandler(
  () => (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="color-scheme" content="dark light" />
            <link rel="icon" href="/favicon.ico" />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  ),
  (context) => {
    const nonce = randomBytes(16).toString("base64");
    const development = process.env.NODE_ENV !== "production";
    context.response.headers.set(
      "Content-Security-Policy",
      createContentSecurityPolicy({ nonce, development }),
    );
    return { nonce };
  },
);
