import { test, expect } from '@playwright/test';

test('debug: what widgets exist on initial load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByText(/FlowStudio/i)).toBeVisible({ timeout: 10000 });

    const canvas = page.getByTestId('phone-canvas-inner');
    await expect(canvas).toBeVisible();

    // Get all widget test IDs
    const allWidgets = canvas.locator('[data-testid^="widget-"]');
    const count = await allWidgets.count();

    console.log(`\n📊 Found ${count} widgets on the canvas:\n`);

    for (let i = 0; i < count; i++) {
        const widget = allWidgets.nth(i);
        const testId = await widget.getAttribute('data-testid');
        const text = await widget.textContent();
        console.log(`  ${i + 1}. ${testId} → "${text}"`);
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/initial-canvas.png' });
});