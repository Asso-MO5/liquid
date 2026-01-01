import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/x-icon" href="https://museedujeuvideo.org/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://museedujeuvideo.org/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://museedujeuvideo.org/favicon.ico" />
          <link rel="apple-touch-icon" sizes="64x64" href="https://museedujeuvideo.org/favicon.ico" />
          <script>
            {`(function() {
              const stored = localStorage.getItem('darkMode');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isDark = stored === 'dark' || (!stored && prefersDark);
              if (isDark) {
                document.documentElement.classList.add('dark');
              }
            })();`}

            {`
              <!-- Matomo -->
                (function() {
                  var _paq = window._paq = window._paq || [];
                  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                  _paq.push(['trackPageView']);
                  _paq.push(['enableLinkTracking']);
                  (function() {
                    var u="//analytics.mo5.com/";
                    _paq.push(['setTrackerUrl', u+'matomo.php']);
                    _paq.push(['setSiteId', '5']);
                    _paq.push(['disableCookies']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                  })();
                })();
              <!-- End Matomo Code -->
            `}
          </script>
          <script src="https://terrors.ben-to.fr/cdn/terrors.js" data-app-id="app_6051n9rr" />
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
