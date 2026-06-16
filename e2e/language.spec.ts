import { test, expect } from '@playwright/test';

test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('switches from English to Arabic', async ({ page }) => {
    // Verify English content first
    await expect(page.getByRole('banner').getByText('AccessMap Egypt', { exact: true })).toBeVisible();

    // Click language toggle
    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();

    // Wait for re-render
    await page.waitForTimeout(500);

    // Verify Arabic content
    await expect(page.getByText('خريطة الوصول مصر')).toBeVisible();
  });

  test('switches from Arabic back to English', async ({ page }) => {
    // Switch to Arabic first
    const arButton = page.getByRole('button', { name: /عربي/ });
    await arButton.click();
    await page.waitForTimeout(500);

    // Verify Arabic
    await expect(page.getByText('خريطة الوصول مصر')).toBeVisible();

    // Switch back to English
    const enButton = page.getByRole('button', { name: /EN/ });
    await enButton.click();
    await page.waitForTimeout(500);

    // Verify English again
    await expect(page.getByRole('banner').getByText('AccessMap Egypt', { exact: true })).toBeVisible();
  });

  test('Arabic layout is RTL', async ({ page }) => {
    // Switch to Arabic
    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    // Check that the HTML dir attribute is RTL
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('English layout is LTR', async ({ page }) => {
    // By default, page is in English
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });

  test('navigation labels change with language', async ({ page }) => {
    // English labels
    await expect(page.getByRole('button', { name: 'Map' })).toBeVisible();

    // Switch to Arabic
    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    // Arabic labels
    await expect(page.getByRole('button', { name: 'الخريطة' })).toBeVisible();
  });

  test('search placeholder changes with language', async ({ page }) => {
    // English placeholder
    const enSearch = page.getByPlaceholder(/Search places by name or category/);
    await expect(enSearch).toBeVisible();

    // Switch to Arabic
    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    // Arabic placeholder
    const arSearch = page.getByPlaceholder(/ابحث عن مكان بالاسم أو الفئة/);
    await expect(arSearch).toBeVisible();
  });
});
