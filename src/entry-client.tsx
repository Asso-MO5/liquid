import { mount, StartClient } from "@solidjs/start/client";

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse non gérée:', event.reason)

    if (event.reason?.message?.includes('Decoding failed') ||
      event.reason?.message?.includes('decoding') ||
      event.reason === 'Decoding failed') {
      console.error('Erreur de décodage détectée:', {
        reason: event.reason,
        promise: event.promise,
        url: window.location.href,
      })
    }

    event.preventDefault()
  })
}

mount(() => <StartClient />, document.getElementById("app")!);

export default {};
