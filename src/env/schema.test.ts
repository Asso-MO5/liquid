import { describe, expect, it } from 'vitest'
import { clientScheme } from './schema'

const clientEnvironment = {
  MODE: 'test',
  VITE_API_URL: 'https://api.example.org',
  VITE_BLOG_URL: 'https://blog.example.org',
  VITE_CAVE_URL: 'https://cave.example.org',
  VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  VITE_KITANA_URL: 'ws://kitana.example.org',
}

describe('feature flag environment variables', () => {
  it('enables a feature only when its value is true', () => {
    expect(
      clientScheme.parse({ ...clientEnvironment, FEAT_RESERVATION: 'true' }).FEAT_RESERVATION,
    ).toBe(true)
  })

  it.each([undefined, 'false', 'TRUE', 'enabled'])(
    'disables absent or invalid values (%s)',
    (value) => {
      expect(
        clientScheme.parse({ ...clientEnvironment, FEAT_RESERVATION: value }).FEAT_RESERVATION,
      ).toBe(false)
    },
  )
})
