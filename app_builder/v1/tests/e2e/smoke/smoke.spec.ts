import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
    test('app should load without crashing', async ({ page }) => {
        // Enable console logging to see errors
        page.on('console', msg => console.log('BROWSER:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err));

        await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });

        // Take a screenshot to see what's rendered
        await page.screenshot({ path: 'test-results/app-loaded.png', fullPage: true });

        // Check if FlowStudio title is visible
        const title = page.getByText(/FlowStudio/i);
        await expect(title).toBeVisible({ timeout: 10000 });

        console.log('✅ App loaded successfully');
    });

    test('canvas should be present', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page.getByText(/FlowStudio/i)).toBeVisible({ timeout: 10000 });

        const canvas = page.getByTestId('phone-canvas-inner');
        await expect(canvas).toBeVisible({ timeout: 5000 });

        console.log('✅ Canvas is present');
    });

    test('component palette should be present', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page.getByText(/FlowStudio/i)).toBeVisible({ timeout: 10000 });

        const buttonPalette = page.getByTestId('palette-item-Button');
        await expect(buttonPalette).toBeVisible({ timeout: 5000 });

        console.log('✅ Component palette is present');
    });
});