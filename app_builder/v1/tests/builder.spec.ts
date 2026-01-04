import { test, expect } from '@playwright/test';

test.describe('App Builder Canvas', () => {
    test.beforeEach(async ({ page }) => {
        // Don't wait for networkidle - it can cause timeouts with hot reload
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        
        // Wait for app to be ready by checking for the canvas
        // await expect(page.getByTestId('phone-canvas-inner')).toBeVisible({ timeout: 15000 });
        // repleced with 
        await expect(page.getByTestId('phone-canvas')).toBeVisible({ timeout: 15000 });

    });

    test('should select a widget on click', async ({ page }) => {
        const canvas = page.getByTestId('phone-canvas-inner');
        
        // Find ANY text widget (more flexible than looking for specific text)
        const textWidget = canvas.getByTestId('widget-Text').first();
        
        // If no text widget exists, skip this test
        const textCount = await canvas.getByTestId('widget-Text').count();
        if (textCount === 0) {
            test.skip();
            return;
        }

        await expect(textWidget).toBeVisible();
        await textWidget.click();

        // Assert Inspector Visibility
        const inspector = page.getByTestId('property-panel');
        await expect(inspector).toBeVisible();
        await expect(inspector).toContainText('Inspector');

        // Assert Content Tab is active
        await expect(inspector.getByText('Content Text')).toBeVisible();

        // Switch to Style Tab
        await page.getByLabel('style tab').click();
        await expect(inspector.getByText('Colors')).toBeVisible();
    });

    test('should be able to drag a new widget to the canvas', async ({ page }) => {
        const paletteItem = page.getByTestId('palette-item-Button');
        const canvas = page.getByTestId('phone-canvas-inner');

        await expect(paletteItem).toBeVisible();
        await expect(canvas).toBeVisible();

        // Count existing buttons BEFORE drag
        const initialButtonCount = await canvas.getByTestId('widget-Button').count();
        console.log('Initial button count:', initialButtonCount);

        await page.evaluate(({ paletteSelector, canvasSelector }) => {
            const palette = document.querySelector(paletteSelector) as HTMLElement;
            const canvas = document.querySelector(canvasSelector) as HTMLElement;

            if (!palette || !canvas) {
                console.error('Elements not found:', { palette: !!palette, canvas: !!canvas });
                throw new Error('Palette or canvas not found');
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Button');
            dataTransfer.setData('draggedWidgetId', ''); // Ensure it's empty string, not undefined/null behavior

            // Dispatch dragstart
            palette.dispatchEvent(
                new DragEvent('dragstart', {
                    dataTransfer,
                    bubbles: true,
                    cancelable: true,
                })
            );

            // Dispatch dragover (CRITICAL: needs to happen on drop target)
            canvas.dispatchEvent(
                new DragEvent('dragover', {
                    dataTransfer,
                    bubbles: true,
                    cancelable: true,
                })
            );

            // Dispatch drop
            canvas.dispatchEvent(
                new DragEvent('drop', {
                    dataTransfer,
                    bubbles: true,
                    cancelable: true,
                })
            );
        }, {
            paletteSelector: '[data-testid="palette-item-Button"]',
            canvasSelector: '[data-testid="phone-canvas-inner"]',
        });

        // ASSERT: Check that a new button was added
        await page.waitForTimeout(500); // Give React time to render
        
        const finalButtonCount = await canvas.getByTestId('widget-Button').count();
        console.log('Final button count:', finalButtonCount);

        // Verify exactly ONE new button was added
        expect(finalButtonCount).toBe(initialButtonCount + 1);

        // Get the last button (most recently added)
        const newButton = canvas.getByTestId('widget-Button').last();
        await expect(newButton).toBeVisible();

        // Verify it has "Button" text (default label for Button widgets)
        await expect(newButton).toContainText('Button');
    });

    test('newly added button should be selectable', async ({ page }) => {
        const canvas = page.getByTestId('phone-canvas-inner');
        
        // Add a button via drag-drop
        await page.evaluate(({ canvasSelector }) => {
            const canvas = document.querySelector(canvasSelector) as HTMLElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Button');
            dataTransfer.setData('draggedWidgetId', '');

            canvas.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            canvas.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        }, { canvasSelector: '[data-testid="phone-canvas-inner"]' });

        await page.waitForTimeout(300);

        // Click the newly added button
        const newButton = canvas.getByTestId('widget-Button').last();
        await newButton.click();

        // Verify inspector shows button properties
        const inspector = page.getByTestId('property-panel');
        await expect(inspector).toContainText('Button');
    });

    test('should add a widget inside a Column container', async ({ page }) => {
        const canvas = page.getByTestId('phone-canvas-inner');

        // Step 1: Add a Column to the canvas
        await page.evaluate(({ canvasSelector }) => {
            const canvas = document.querySelector(canvasSelector) as HTMLElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Column');
            dataTransfer.setData('draggedWidgetId', '');

            canvas.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            canvas.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        }, { canvasSelector: '[data-testid="phone-canvas-inner"]' });

        await page.waitForTimeout(500);

        // Verify Column was added
        const columnWidget = canvas.getByTestId('widget-Column').last();
        await expect(columnWidget).toBeVisible({ timeout: 10000 });
        
        // Check for placeholder text (it might be inside a nested div)
        const hasPlaceholder = await columnWidget.getByText('Drop widgets here').isVisible().catch(() => false);
        console.log('Has placeholder:', hasPlaceholder);

        // Step 2: Drag a Button ONTO the Column
        await page.evaluate(() => {
            const column = Array.from(document.querySelectorAll('[data-testid="widget-Column"]')).pop() as HTMLElement;
            if (!column) throw new Error('Column not found');
            
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Button');
            dataTransfer.setData('draggedWidgetId', '');

            column.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            column.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        });

        await page.waitForTimeout(500);

        // Step 3: Verify Button is inside Column
        const buttonInsideColumn = columnWidget.getByTestId('widget-Button');
        await expect(buttonInsideColumn).toBeVisible({ timeout: 10000 });

        // Step 4: Click the button and verify it's selectable
        await buttonInsideColumn.click();
        const inspector = page.getByTestId('property-panel');
        await expect(inspector).toContainText('Button');
    });

    test('should add multiple widgets inside a Row container', async ({ page }) => {
        const canvas = page.getByTestId('phone-canvas-inner');

        // Add a Row
        await page.evaluate(({ canvasSelector }) => {
            const canvas = document.querySelector(canvasSelector) as HTMLElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Row');
            dataTransfer.setData('draggedWidgetId', '');

            canvas.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            canvas.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        }, { canvasSelector: '[data-testid="phone-canvas-inner"]' });

        await page.waitForTimeout(300);

        const rowWidget = canvas.getByTestId('widget-Row').last();
        await expect(rowWidget).toBeVisible();

        // Add first button
        await page.evaluate(() => {
            const row = document.querySelector('[data-testid="widget-Row"]') as HTMLElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Button');
            dataTransfer.setData('draggedWidgetId', '');

            row.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            row.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        });

        await page.waitForTimeout(300);

        // Add second button
        await page.evaluate(() => {
            const row = document.querySelector('[data-testid="widget-Row"]') as HTMLElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('widgetType', 'Button');
            dataTransfer.setData('draggedWidgetId', '');

            row.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true }));
            row.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
        });

        await page.waitForTimeout(300);

        // Verify both buttons are inside the Row
        const buttonsInRow = rowWidget.getByTestId('widget-Button');
        expect(await buttonsInRow.count()).toBe(2);
    });
});