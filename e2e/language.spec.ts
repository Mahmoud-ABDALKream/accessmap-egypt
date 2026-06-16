import { test, expect } from '@playwright/test';

test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('switches from English to Arabic', async ({ page }) => {
    await expect(page.getByRole('banner').getByText('AccessMap Egypt', { exact: true })).toBeVisible();

    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('banner').getByText('خريطة الوصول مصر', { exact: true })).toBeVisible();
  });

  test('switches from Arabic back to English', async ({ page }) => {
    const arButton = page.getByRole('button', { name: /عربي/ });
    await arButton.click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('banner').getByText('خريطة الوصول مصر', { exact: true })).toBeVisible();

    const enButton = page.getByRole('button', { name: /EN/ });
    await enButton.click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('banner').getByText('AccessMap Egypt', { exact: true })).toBeVisible();
  });

  test('Arabic layout is RTL', async ({ page }) => {
    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('English layout is LTR', async ({ page }) => {
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });

  test('navigation labels change with language', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Map' })).toBeVisible();

    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('button', { name: 'الخريطة' })).toBeVisible();
  });

  test('search placeholder changes with language', async ({ page }) => {
    const enSearch = page.getByPlaceholder(/Search places by name or category/).first();
    await expect(enSearch).toBeVisible();

    const langButton = page.getByRole('button', { name: /عربي/ });
    await langButton.click();
    await page.waitForTimeout(500);

    const arSearch = page.getByPlaceholder(/ابحث عن مكان بالاسم أو الفئة/).first();
    await expect(arSearch).toBeVisible();
  });
});
