export interface SecurityHeadersOptions {
  nonce: string;
  development?: boolean;
}

/**
 * Politique de sécurité du contenu. Le nonce est généré par requête côté
 * serveur ; en développement, `unsafe-eval` autorise le rechargement à chaud.
 */
export function createContentSecurityPolicy({
  nonce,
  development = false,
}: SecurityHeadersOptions): string {
  const scriptSrc = development
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

/** En-têtes de protection appliqués à toutes les routes, sans la CSP. */
export const standardSecurityHeaders: Record<string, string> = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};
