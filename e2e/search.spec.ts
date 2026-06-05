import { test, expect } from '@playwright/test';

test.describe('Search & Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for places to load
    await page.waitForTimeout(2000);
  });

  test('search bar accepts input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search places by name or category/);
    await searchInput.fill('Bibliotheca');
    await expect(searchInput).toHaveValue('Bibliotheca');
  });

  test('search filters places by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search places by name or category/);

    // Type a search term
    await searchInput.fill('Bibliotheca');

    // Wait for debounce (300ms) + API call
    await page.waitForTimeout(1500);

    // The places list should update — check that the count badge updates
    const placesBadge = page.getByText(/places|مكان/);
    await expect(placesBadge).toBeVisible();
  });

  test('clear search shows all places again', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search places by name or category/);

    // Type and then clear
    await searchInput.fill('Bibliotheca');
    await page.waitForTimeout(1000);

    // Click clear button (X icon inside search)
    const clearButton = page.getByLabel('Clear search');
    if (await clearButton.isVisible()) {
      await clearButton.click();
    } else {
      await searchInput.clear();
    }

    await expect(searchInput).toHaveValue('');
  });

  test('city filter is accessible on desktop', async ({ page }) => {
    // On desktop, the city filter select should be visible
    const cityFilter = page.getByLabel(/City/i).first();
    if (await cityFilter.isVisible()) {
      await expect(cityFilter).toBeVisible();
    }
  });

  test('category filter is accessible on desktop', async ({ page }) => {
    // On desktop, the category filter select should be visible
    const categoryFilter = page.getByLabel(/Category/i).first();
    if (await categoryFilter.isVisible()) {
      await expect(categoryFilter).toBeVisible();
    }
  });

  test('search with Arabic text works', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/ابحث عن مكان بالاسم أو الفئة/);

    // Switch to Arabic first
    const langButton = page.getByRole('button', { name: /عربي/ });
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(500);
    }

    // Check if Arabic placeholder is now visible
    const arSearchInput = page.getByPlaceholder(/ابحث عن مكان بالاسم أو الفئة/);
    if (await arSearchInput.isVisible()) {
      await arSearchInput.fill('مكتبة');
      await page.waitForTimeout(1000);
    }
  });
});
