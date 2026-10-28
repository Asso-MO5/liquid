import { expect, test } from '@playwright/test'

test.describe('En-têtes de sécurité', () => {
  test('/fr renvoie des garde-fous de base', async ({ request }) => {
    const response = await request.get('/fr', {
      headers: { Accept: 'text/html,*/*' },
    })

    expect(response.status()).toBe(200)
    const headers = response.headers()

    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
  })
})
