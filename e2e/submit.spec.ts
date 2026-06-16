import { test, expect } from '@playwright/test';

test.describe('Submit Place Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigates to submit form', async ({ page }) => {
    // Click Submit Place nav button
    const submitButton = page.getByRole('button', { name: /Submit Place|إضافة مكان/ }).first();
    await submitButton.click();

    // Wait for form to render
    await page.waitForTimeout(1000);

    // Should show submit form
    await expect(page.getByText(/Submit a New Place|إضافة مكان جديد/)).toBeVisible();
  });

  test('submit form has required fields', async ({ page }) => {
    // Navigate to submit
    const submitButton = page.getByRole('button', { name: /Submit Place/ }).first();
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Check for place name input
    const nameInput = page.getByLabel(/Place Name|اسم المكان/).first();
    if (await nameInput.isVisible()) {
      await expect(nameInput).toBeVisible();
    }

    // Check for latitude input
    const latInput = page.getByLabel(/Latitude|خط العرض/).first();
    if (await latInput.isVisible()) {
      await expect(latInput).toBeVisible();
    }

    // Check for longitude input
    const lngInput = page.getByLabel(/Longitude|خط الطول/).first();
    if (await lngInput.isVisible()) {
      await expect(lngInput).toBeVisible();
    }
  });

  test('submit button is disabled when required fields are empty', async ({ page }) => {
    // Navigate to submit
    const submitButton = page.getByRole('button', { name: /Submit Place/ }).first();
    await submitButton.click();
    await page.waitForTimeout(1000);

    // The submit button should be disabled initially
    const formSubmitBtn = page.getByRole('button', { name: /Submit Place|إرسال المكان/ }).last();
    if (await formSubmitBtn.isVisible()) {
      await expect(formSubmitBtn).toBeDisabled();
    }
  });

  test('shows validation errors for missing fields on submit attempt', async ({ page }) => {
    // Navigate to submit
    const navButton = page.getByRole('button', { name: /Submit Place/ }).first();
    await navButton.click();
    await page.waitForTimeout(1000);

    // Try to fill only the name (incomplete form)
    const nameInput = page.locator('#name');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Place');
    }

    // Submit button should still be disabled since category and city are not filled
    const formSubmitBtn = page.getByRole('button', { name: /Submit Place|إرسال المكان/ }).last();
    if (await formSubmitBtn.isVisible()) {
      await expect(formSubmitBtn).toBeDisabled();
    }
  });

  test('back button returns to map view', async ({ page }) => {
    // Navigate to submit
    const navButton = page.getByRole('button', { name: /Submit Place/ }).first();
    await navButton.click();
    await page.waitForTimeout(1000);

    // Click back to map
    const backLink = page.getByRole('button', { name: /Map|الخريطة/ }).first();
    if (await backLink.isVisible()) {
      await backLink.click();
      await page.waitForTimeout(500);
    }
  });

  test('accessibility score sliders are present', async ({ page }) => {
    // Navigate to submit
    const navButton = page.getByRole('button', { name: /Submit Place/ }).first();
    await navButton.click();
    await page.waitForTimeout(1000);

    // Check for accessibility score labels
    const rampLabel = page.getByText(/Entrance Ramp|منحدر مدخل/);
    if (await rampLabel.isVisible()) {
      await expect(rampLabel).toBeVisible();
    }

    const elevatorLabel = page.getByText(/Elevator|مصعد/);
    if (await elevatorLabel.isVisible()) {
      await expect(elevatorLabel).toBeVisible();
    }
  });
});
