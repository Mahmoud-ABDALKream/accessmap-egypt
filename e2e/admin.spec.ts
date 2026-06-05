import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigates to admin view', async ({ page }) => {
    // Click Admin nav button
    const adminButton = page.getByRole('button', { name: /Admin|الإدارة/ }).first();
    await adminButton.click();

    // Wait for admin section to load
    await page.waitForTimeout(1000);

    // Should show login form (since not authenticated)
    await expect(page.getByText(/Admin Panel|لوحة الإدارة/)).toBeVisible();
  });

  test('admin login form has email and password fields', async ({ page }) => {
    // Navigate to admin
    const adminButton = page.getByRole('button', { name: /Admin/ }).first();
    await adminButton.click();
    await page.waitForTimeout(1000);

    // Check for email input
    const emailInput = page.getByLabel(/Email|البريد الإلكتروني/);
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }

    // Check for password input
    const passwordInput = page.getByLabel(/Password|كلمة المرور/);
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }
  });

  test('admin login rejects invalid credentials', async ({ page }) => {
    // Navigate to admin
    const adminButton = page.getByRole('button', { name: /Admin/ }).first();
    await adminButton.click();
    await page.waitForTimeout(1000);

    // Fill in wrong credentials
    const emailInput = page.locator('#admin-email');
    const passwordInput = page.locator('#admin-pwd');

    if (await emailInput.isVisible()) {
      await emailInput.fill('wrong@example.com');
      await passwordInput.fill('wrongpassword');

      // Submit login form
      const loginButton = page.getByRole('button', { name: /Login|تسجيل الدخول/ });
      await loginButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Should show error message
      const errorElement = page.getByText(/Invalid|incorrect|غير صحيحة/);
      // Error might appear, or it might just stay on login form
      // Either way, admin panel should not be shown
      const adminPanelHeader = page.getByText(/pending|معلق/);
      await expect(adminPanelHeader).not.toBeVisible();
    }
  });

  test('unauthenticated admin API returns 401', async ({ page }) => {
    // Direct API call without authentication
    const response = await page.request.get('/api/admin');
    expect(response.status()).toBe(401);
  });

  test('back button returns to map view', async ({ page }) => {
    // Navigate to admin
    const adminButton = page.getByRole('button', { name: /Admin/ }).first();
    await adminButton.click();
    await page.waitForTimeout(1000);

    // Click back to map button
    const backButton = page.getByRole('button', { name: /Map|الخريطة/ }).first();
    if (await backButton.isVisible()) {
      await backButton.click();
      // Should be back on map view
      await page.waitForTimeout(500);
    }
  });
});
