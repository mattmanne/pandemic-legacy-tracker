import { test, expect } from '@playwright/test'

async function selectPlayer(page, name = 'Matt') {
  await page.goto('/')
  await page.getByText(name).click()
}

test('shows player picker on first visit', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Who are you?')).toBeVisible()
})

test('app loads and shows navigation after selecting a player', async ({ page }) => {
  await selectPlayer(page)
  await expect(page.getByRole('heading', { name: 'Pandemic Legacy' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Log' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'State' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Characters' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Rules' })).toBeVisible()
})

test('navigates to state page', async ({ page }) => {
  await selectPlayer(page)
  await page.getByRole('link', { name: 'State' }).click()
  await expect(page.getByText('Campaign State — coming soon')).toBeVisible()
})

test('navigates to characters page', async ({ page }) => {
  await selectPlayer(page)
  await page.getByRole('link', { name: 'Characters' }).click()
  await expect(page.getByText('Characters — coming soon')).toBeVisible()
})

test('navigates to rules page', async ({ page }) => {
  await selectPlayer(page)
  await page.getByRole('link', { name: 'Rules' }).click()
  await expect(page.getByText('Rules — coming soon')).toBeVisible()
})
