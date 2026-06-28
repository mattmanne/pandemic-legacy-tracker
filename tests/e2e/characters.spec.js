import { test, expect } from '@playwright/test'

async function openCharactersPage(page) {
  await page.goto('/')
  await page.getByText('Matt').click()
  await page.getByRole('link', { name: 'Characters' }).click()
}

test('characters page loads with all 4 player cards', async ({ page }) => {
  await openCharactersPage(page)
  await expect(page.getByRole('heading', { name: 'Carlos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Jen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Michelle' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Matt' })).toBeVisible()
})

test('each card has character name and role fields', async ({ page }) => {
  await openCharactersPage(page)
  await expect(page.getByRole('heading', { name: 'Carlos' })).toBeVisible()
  expect(await page.getByPlaceholder('Character name').count()).toBe(4)
  expect(await page.getByPlaceholder('Role / class').count()).toBe(4)
})

test('each card has upgrades and scars sections', async ({ page }) => {
  await openCharactersPage(page)
  await expect(page.getByText('Upgrades').first()).toBeVisible()
  await expect(page.getByText('Scars').first()).toBeVisible()
})

test('each card has relationships section', async ({ page }) => {
  await openCharactersPage(page)
  await expect(page.getByText('Relationships').first()).toBeVisible()
})

test('can type a character name', async ({ page }) => {
  await openCharactersPage(page)
  await expect(page.getByRole('heading', { name: 'Carlos' })).toBeVisible()
  const nameInput = page.getByPlaceholder('Character name').first()
  await nameInput.fill('Agent X')
  await nameInput.blur()
  await expect(nameInput).toHaveValue('Agent X')
})
