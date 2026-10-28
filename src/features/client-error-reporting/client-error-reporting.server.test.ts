import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseClientErrorReport, receiveClientError } from './client-error-reporting.server'

const validReport = {
  message: 'Impossible de charger les créneaux',
  page: '/fr/reservation',
  stack: 'Error: Impossible de charger les créneaux',
  type: 'error',
}

describe('client error reporting', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('accepts a bounded, structured browser error', () => {
    expect(parseClientErrorReport(JSON.stringify(validReport))).toMatchObject({
      success: true,
      data: validReport,
    })
  })

  it('rejects unknown fields and unbounded payloads', () => {
    expect(
      parseClientErrorReport(JSON.stringify({ ...validReport, extra: 'ignore me' })),
    ).toMatchObject({
      success: false,
    })
    expect(parseClientErrorReport('x'.repeat(8 * 1024 + 1))).toBeNull()
  })

  it('logs a readable, redacted report', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const request = new Request('https://museedujeuvideo.org/api/client-errors', {
      body: JSON.stringify({
        ...validReport,
        message: 'Contact alice@example.org token=private-value',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      },
      method: 'POST',
    })

    await expect(receiveClientError(request)).resolves.toMatchObject({ status: 204 })
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('message="Contact [redacted-email] token=[redacted]"'),
    )
  })

  it('rejects a request that is not JSON without logging it', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const request = new Request('https://museedujeuvideo.org/api/client-errors', {
      body: 'not json',
      method: 'POST',
    })

    await expect(receiveClientError(request)).resolves.toMatchObject({ status: 415 })
    expect(error).not.toHaveBeenCalled()
  })

  it('rejects an oversized JSON request without logging it', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const request = new Request('https://museedujeuvideo.org/api/client-errors', {
      body: JSON.stringify({ ...validReport, stack: 'x'.repeat(8 * 1024) }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })

    await expect(receiveClientError(request)).resolves.toMatchObject({ status: 413 })
    expect(error).not.toHaveBeenCalled()
  })
})
