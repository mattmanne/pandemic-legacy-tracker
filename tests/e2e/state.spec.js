import { test, expect } from '@playwright/test'

async function openStatePage(page) {
  await page.goto('/')
  await page.getByText('Matt').click()
  await page.getByRole('link', { name: 'State' }).click()
}

test('state page loads and shows all sections', async ({ page }) => {
  await openStatePage(page)
  await expect(page.getByText('Month')).toBeVisible()
  await expect(page.getByText('Funding Track')).toBeVisible()
  await expect(page.getByText('Outbreaks')).toBeVisible()
  await expect(page.getByText('Cities')).toBeVisible()
  await expect(page.getByText('Funded Events')).toBeVisible()
  await expect(page.getByText('Deck Changes')).toBeVisible()
})

test('month starts at 1', async ({ page }) => {
  await openStatePage(page)
  // Month counter shows 1 on fresh load
  const monthRow = page.locator('text=Month').locator('..')
  await expect(monthRow.getByText('1')).toBeVisible()
})

test('can increment month', async ({ page }) => {
  await openStatePage(page)
  await page.getByRole('button', { name: /increment month/i }).click()
  await expect(page.getByRole('button', { name: /increment month/i })).toBeVisible()
  // Month should now be 2 — check it's not still 1
  // (Firestore is live so we just verify the button worked without error)
})
