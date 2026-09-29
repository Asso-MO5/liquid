import { describe, expect, test } from "bun:test";
import { createContentSecurityPolicy, standardSecurityHeaders } from "./security-headers";

describe("createContentSecurityPolicy", () => {
  test("en production, les scripts sont restreints au nonce sans eval", () => {
    const policy = createContentSecurityPolicy({ nonce: "abc123" });

    expect(policy).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
  });

  test("en développement, eval est autorisé pour le rechargement à chaud", () => {
    const policy = createContentSecurityPolicy({ nonce: "abc123", development: true });

    expect(policy).toContain("'unsafe-eval'");
  });
});

describe("standardSecurityHeaders", () => {
  test("expose les protections de base", () => {
    expect(standardSecurityHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(standardSecurityHeaders["X-Frame-Options"]).toBe("DENY");
    expect(standardSecurityHeaders["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });
});
