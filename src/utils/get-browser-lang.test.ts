import { describe, expect, it, vi } from 'vitest'
import { getBrowserLang } from './get-browser-lang'

describe('getBrowserLang', () => {
  it('returns en for English browser locales', () => {
    vi.stubGlobal('navigator', { language: 'en-US' })

    expect(getBrowserLang()).toBe('en')
  })

  it('falls back to fr for unsupported browser locales', () => {
    vi.stubGlobal('navigator', { language: 'es-ES' })

    expect(getBrowserLang()).toBe('fr')
  })
})
