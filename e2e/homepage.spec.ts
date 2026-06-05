import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AccessMap Egypt/);
  });

  test('header is visible with app name', async ({ page }) => {
    await expect(page.getByText('AccessMap Egypt')).toBeVisible();
  });

  test('map container loads', async ({ page }) => {
    // Wait for the map container to render (Leaflet is dynamically imported)
    const mapContainer = page.locator('[data-testid="map-container"], .leaflet-container').first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('navigation tabs are visible on desktop', async ({ page }) => {
    // Desktop navigation items
    await expect(page.getByRole('button', { name: /Map/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Place/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Statistics/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /About/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Admin/ })).toBeVisible();
  });

  test('footer is visible on desktop', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/AccessMap Egypt/)).toBeVisible();
  });

  test('language toggle button is present', async ({ page }) => {
    const langButton = page.getByRole('button', { name: /عربي|Switch to English/ });
    await expect(langButton).toBeVisible();
  });

  test('search bar is visible', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search places by name or category/);
    await expect(searchInput).toBeVisible();
  });

  test('places are loaded and displayed', async ({ page }) => {
    // Wait for places to load (markers on the map)
    await page.waitForTimeout(3000);
    // Check that the places count badge or some marker is visible
    const markerElements = page.locator('.leaflet-marker-icon, .custom-marker');
    // Either markers or fallback data is shown
    const placesBadge = page.getByText(/places|مكان/);
    await expect(placesBadge.or(markerElements.first())).toBeVisible({ timeout: 10000 });
  });
});
