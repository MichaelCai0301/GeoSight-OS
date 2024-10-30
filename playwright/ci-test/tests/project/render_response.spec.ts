import { test, expect } from '@playwright/test';

test.describe('render_response functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page where render_response is used
    await page.goto('http://localhost:3000'); // Update to your actual app URL
  });

  test('renders data correctly from api_response', async ({ page }) => {
    // Simulate providing `api_response` data via a mock or page input
    await page.evaluate(() => {
      const api_response = {
        data: 'TIME_PERIOD,OBS_VALUE\n2023-01,100\n2023-02,200', // Sample CSV string
      };
      render_response(api_response); // Trigger function directly
    });

    // Verify UI changes (for example, checking the DataGrid)
    const dataGrid = await page.locator('.data-grid'); // Update selector to match your component
    await expect(dataGrid).toBeVisible();
    await expect(dataGrid).toContainText('2023-01');
    await expect(dataGrid).toContainText('100');
  });

  test('handles errors in CSV parsing', async ({ page }) => {
    await page.evaluate(() => {
      const api_response = { data: 'Invalid data' };
      render_response(api_response);
    });

    // Check for an error message or state update
    const error = await page.locator('.error-message'); // Update selector to match your error component
    await expect(error).toBeVisible();
    await expect(error).toHaveText('The response is not in CSV format');
  });
});
