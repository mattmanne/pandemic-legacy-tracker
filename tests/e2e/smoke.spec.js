import { test, expect } from '@playwright/test'

test('app loads and shows navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Pandemic Legacy')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Log' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'State' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Characters' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Rules' })).toBeVisible()
})

test('navigates to state page', async ({ page }) => {
  await page.goto('/')
  await page.getByText('State').click()
  await expect(page.getByText('Campaign State — coming soon')).toBeVisible()
})

test('navigates to characters page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /characters/i }).click()
  await expect(page.getByText('Characters — coming soon')).toBeVisible()
})

test('navigates to rules page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /rules/i }).click()
  await expect(page.getByText('Rules — coming soon')).toBeVisible()
})
