import { describe, expect, it } from 'vitest'
import { getPublicEnv, serializePublicEnv } from './public'

describe('public runtime environment', () => {
  it('only exposes the allow-listed browser variables', () => {
    expect(
      getPublicEnv({
        VITE_API_URL: 'https://api.example.org',
        FEAT_RESERVATION: 'true',
        RESEND_API_KEY: 'secret',
      }),
    ).toEqual({
      VITE_API_URL: 'https://api.example.org',
      FEAT_RESERVATION: 'true',
    })
  })

  it('does not replace build-time values with missing runtime variables', () => {
    expect(getPublicEnv({})).toEqual({})
  })

  it('serializes values safely for an inline script', () => {
    expect(
      serializePublicEnv({ VITE_API_URL: '</script><script>alert(1)</script>' }),
    ).not.toContain('</script>')
  })
})
