import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AccessMap Egypt/);
  });

  test('header is visible with app name', async ({ page }) => {
    await expect(page.getByRole('banner').getByText('AccessMap Egypt', { exact: true })).toBeVisible();
  });

  test('map container loads', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container').first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('navigation tabs are visible on desktop', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Map/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Place/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Statistics/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /About/ })).toBeVisible();
  });

  test('footer is visible on desktop', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await expect(footer.getByText('AccessMap Egypt', { exact: true })).toBeVisible();
  });

  test('language toggle button is present', async ({ page }) => {
    const langButton = page.getByRole('button', { name: /عربي|Switch to English/ });
    await expect(langButton).toBeVisible();
  });

  test('search bar is visible', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search places by name or category/).first();
    await expect(searchInput).toBeVisible();
  });

  test('places are loaded and displayed', async ({ page }) => {
    await page.waitForTimeout(3000);
    const markerElements = page.locator('.leaflet-marker-icon');
    await expect(markerElements.first()).toBeVisible({ timeout: 10000 });
  });
});
