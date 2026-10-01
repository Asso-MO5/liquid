import { createHandler, StartServer } from '@solidjs/start/server'

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/x-icon" href="https://museedujeuvideo.org/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://museedujeuvideo.org/favicon.ico"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://museedujeuvideo.org/favicon.ico"
          />
          <link
            rel="apple-touch-icon"
            sizes="64x64"
            href="https://museedujeuvideo.org/favicon.ico"
          />
          <script>
            {`(function() {
              const stored = localStorage.getItem('darkMode');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isDark = stored === 'dark' || (!stored && prefersDark);
              if (isDark) {
                document.documentElement.classList.add('dark');
              }
            })();`}
          </script>
          <script
            defer
            src="https://analytics.mo5.fr/script.js"
            data-website-id="1754217f-f573-486a-9ffd-6457d62777b6"
          />
          {/* <script src="https://terrors.ben-to.fr/cdn/terrors.js" data-app-id="app_6051n9rr" /> */}
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
