import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
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
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
