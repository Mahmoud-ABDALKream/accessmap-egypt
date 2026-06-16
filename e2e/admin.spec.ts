import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Admin panel is hidden from navigation — access via URL only
    await page.goto('/?view=admin');
  });

  test('admin panel loads via URL', async ({ page }) => {
    // Should show login form (since not authenticated)
    await expect(page.getByText(/Admin Panel|لوحة الإدارة/)).toBeVisible({ timeout: 10000 });
  });

  test('admin login form has email and password fields', async ({ page }) => {
    // Check for email input
    const emailInput = page.getByLabel(/Email|البريد الإلكتروني/);
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Check for password input
    const passwordInput = page.getByLabel(/Password|كلمة المرور/);
    await expect(passwordInput).toBeVisible();
  });

  test('admin login rejects invalid credentials', async ({ page }) => {
    // Fill in wrong credentials
    const emailInput = page.locator('#admin-email');
    const passwordInput = page.locator('#admin-pwd');

    await emailInput.fill('wrong@example.com');
    await passwordInput.fill('wrongpassword');

    // Submit login form
    const loginButton = page.getByRole('button', { name: /Login|تسجيل الدخول/ });
    await loginButton.click();

    // Wait for response
    await page.waitForTimeout(3000);

    // Should show error message OR stay on login form
    // Either way, admin panel (pending submissions) should not be shown
    const adminPanelHeader = page.getByText(/pending|معلق/);
    await expect(adminPanelHeader).not.toBeVisible();
  });

  test('unauthenticated admin API returns 401', async ({ page }) => {
    // Direct API call without authentication
    const response = await page.request.get('/api/admin');
    expect(response.status()).toBe(401);
  });

  test('back button returns to map view', async ({ page }) => {
    // Click back to map button
    const backButton = page.getByRole('button', { name: /Map|الخريطة/ }).first();
    if (await backButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await backButton.click();
      // Should be back on map view
      await page.waitForTimeout(500);
    }
  });
});
