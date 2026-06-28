import { test, expect } from '@playwright/test'

async function openLogPage(page) {
  await page.goto('/')
  await page.getByText('Matt').click()
  // Log is the default route — already there
}

test('campaign log page shows W/L summary', async ({ page }) => {
  await openLogPage(page)
  // Summary is always rendered (even 0W / 0L)
  await expect(page.getByText(/\dW \/ \dL/)).toBeVisible()
})

test('Add Session button is visible', async ({ page }) => {
  await openLogPage(page)
  await expect(page.getByRole('button', { name: /add session/i })).toBeVisible()
})

test('clicking Add Session shows the form', async ({ page }) => {
  await openLogPage(page)
  await page.getByRole('button', { name: /add session/i }).click()
  await expect(page.getByLabel('Month')).toBeVisible()
  await expect(page.getByLabel('Date played')).toBeVisible()
})

test('can add a session and it appears in the list', async ({ page }) => {
  await openLogPage(page)
  await page.getByRole('button', { name: /add session/i }).click()
  await page.getByLabel('Month').fill('3')
  await page.getByLabel('Date played').fill('2026-03-15')
  await page.getByRole('button', { name: /^win$/i }).click()
  await page.getByRole('button', { name: /save/i }).click()
  // After save, the form closes and the session appears
  await expect(page.getByText('Month 3')).toBeVisible()
})
