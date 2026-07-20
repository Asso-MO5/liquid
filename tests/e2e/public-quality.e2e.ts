import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const qualityOutDir = path.resolve(process.cwd(), 'quality-out')

async function writeJsonReport(fileName: string, payload: unknown): Promise<void> {
  await mkdir(qualityOutDir, { recursive: true })
  await writeFile(path.join(qualityOutDir, fileName), JSON.stringify(payload, null, 2), 'utf8')
}

test.describe('Qualité publique', () => {
  test('la page d’accueil FR expose le contenu, les metas SEO et reste accessible', async ({
    page,
  }) => {
    await page.goto('/fr')

    await expect(page.getByRole('heading', { name: /Le Musée du jeu vidéo/i })).toBeVisible()
    await expect(page.locator('main#main')).toBeVisible()
    await expect.poll(() => page.title()).toMatch(/musée du jeu vidéo/i)
    await expect(page.locator('meta[name="description"]').first()).toHaveAttribute(
      'content',
      /musée du jeu vidéo/i,
    )
    await expect(page.locator('meta[name="viewport"]').first()).toHaveAttribute(
      'content',
      /width=device-width/i,
    )
    await expect(page.locator('meta[name="og:image"]').first()).toHaveAttribute(
      'content',
      /^https?:\/\//,
    )
    await expect(page.locator('meta[name="og:title"]').first()).toHaveAttribute(
      'content',
      /musée du jeu vidéo/i,
    )

    const splashModalButton = page.getByRole('button', { name: 'OK' })
    if (await splashModalButton.isVisible()) {
      await splashModalButton.click()
    }

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules([
        // Les contrastes sont couverts par Lighthouse ; cette règle peut être instable avec les thèmes dynamiques.
        'color-contrast',
      ])
      .analyze()

    await writeJsonReport('a11y-summary.json', {
      axeViolationCount: accessibilityScanResults.violations.length,
      axeViolationIds: accessibilityScanResults.violations.map((violation) => violation.id),
      recordedAt: new Date().toISOString(),
    })

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('la navigation produit des métriques de performance exploitables', async ({ page }) => {
    await page.goto('/fr')
    await page.waitForLoadState('domcontentloaded')

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined

      return nav
        ? {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
            loadEventEnd: nav.loadEventEnd - nav.startTime,
          }
        : null
    })

    await writeJsonReport('perf-summary.json', {
      navigationTiming: timing,
      recordedAt: new Date().toISOString(),
    })

    expect(timing).not.toBeNull()
  })
})
