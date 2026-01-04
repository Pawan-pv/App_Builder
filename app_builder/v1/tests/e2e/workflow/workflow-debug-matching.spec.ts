// tests/e2e/workflow/workflow-debug-matching.spec.ts
// Debug test that follows the EXACT same flow as the main test

import { test, expect } from "@playwright/test";

test.describe("Workflow Debug - Matching Main Flow", () => {
  test("debug the exact same flow as main test", async ({ page }) => {
    // Same setup as main test
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/FlowStudio/i)).toBeVisible({ timeout: 15000 });

    console.log('✓ App loaded');

    // Click "Welcome Back" (same as main test)
    await page.getByText("Welcome Back").click();
    console.log('✓ Clicked "Welcome Back"');

    // Verify inspector opens
    const inspector = page.getByTestId("property-panel");
    await expect(inspector).toBeVisible();
    console.log('✓ Inspector visible');

    // Open FLOW tab
    await page.getByLabel("flow tab").click();
    console.log('✓ Clicked flow tab');

    // Wait for workflow editor
    const workflowEditor = page.getByTestId("workflow-editor");
    await expect(workflowEditor).toBeVisible();
    console.log('✓ Workflow editor visible');

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/debug-1-initial.png', fullPage: true });

    // Check for trigger node
    const triggerNode = page.locator(".react-flow__node-trigger");
    const triggerExists = await triggerNode.count();
    console.log(`Trigger nodes found: ${triggerExists}`);
    
    if (triggerExists > 0) {
      await expect(triggerNode).toBeVisible({ timeout: 5000 });
      console.log('✓ Trigger node visible');
      
      // Check trigger node text
      const triggerText = await triggerNode.textContent();
      console.log(`Trigger text: "${triggerText}"`);
    } else {
      console.log('✗ NO trigger node found!');
    }

    // List all React Flow nodes
    const allNodes = await page.locator('.react-flow__node').all();
    console.log(`\nTotal React Flow nodes: ${allNodes.length}`);
    
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const classes = await node.getAttribute('class');
      const text = await node.textContent();
      console.log(`  Node ${i}: ${classes}`);
      console.log(`    Text: "${text}"`);
    }

    // Check for node palette
    const paletteHeader = page.locator('text=Nodes');
    const paletteExists = await paletteHeader.count();
    console.log(`\nNode palette found: ${paletteExists > 0}`);

    // Find Navigate in palette
    const navigatePaletteItems = await page.locator('text=Navigate').all();
    console.log(`Navigate items in DOM: ${navigatePaletteItems.length}`);
    
    for (let i = 0; i < navigatePaletteItems.length; i++) {
      const item = navigatePaletteItems[i];
      const isVisible = await item.isVisible();
      const text = await item.textContent();
      console.log(`  Navigate item ${i}: visible=${isVisible}, text="${text}"`);
    }

    // Try to find the specific palette item with icon
    const navigatePaletteItem = page
      .locator('div:has-text("Navigate")')
      .filter({ has: page.locator('svg') })
      .first();
    
    const paletteItemExists = await navigatePaletteItem.count();
    console.log(`\nNavigate palette item (with icon): ${paletteItemExists}`);
    
    if (paletteItemExists > 0) {
      const isVisible = await navigatePaletteItem.isVisible();
      console.log(`Navigate palette item visible: ${isVisible}`);
      
      // Get bounds
      const bounds = await navigatePaletteItem.boundingBox();
      console.log(`Navigate palette item bounds:`, bounds);
    }

    // Check React Flow renderer
    const renderer = page.locator('.react-flow__renderer');
    const rendererExists = await renderer.count();
    console.log(`\nReact Flow renderer found: ${rendererExists}`);
    
    if (rendererExists > 0) {
      const bounds = await renderer.first().boundingBox();
      console.log(`React Flow renderer bounds:`, bounds);
    }

    // Take final screenshot
    await page.screenshot({ path: 'test-results/debug-2-final.png', fullPage: true });

    console.log('\n=== Debug test complete ===');
    console.log('Check screenshots in test-results/ folder');
  });

  test("try drag and drop with detailed logging", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/FlowStudio/i)).toBeVisible({ timeout: 15000 });

    await page.getByText("Welcome Back").click();
    await page.getByLabel("flow tab").click();
    await expect(page.getByTestId("workflow-editor")).toBeVisible();

    console.log('\n=== Starting drag and drop test ===');

    // Find palette item
    const navigatePaletteItem = page
      .locator('div')
      .filter({ hasText: 'Navigate' })
      .filter({ has: page.locator('svg') })
      .first();

    const paletteExists = await navigatePaletteItem.count();
    console.log(`Palette item found: ${paletteExists}`);

    if (paletteExists === 0) {
      // Try alternative selector
      const altSelector = page.locator('[draggable="true"]').filter({ hasText: 'Navigate' });
      const altExists = await altSelector.count();
      console.log(`Alternative draggable selector found: ${altExists}`);
      
      if (altExists > 0) {
        console.log('Using alternative selector for drag');
        const altBounds = await altSelector.first().boundingBox();
        console.log('Alt bounds:', altBounds);
      }
    } else {
      await expect(navigatePaletteItem).toBeVisible();
      console.log('✓ Navigate palette item visible');

      const renderer = page.locator('.react-flow__renderer').first();
      await expect(renderer).toBeVisible();

      const paletteBounds = await navigatePaletteItem.boundingBox();
      const canvasBounds = await renderer.boundingBox();

      console.log('Palette bounds:', paletteBounds);
      console.log('Canvas bounds:', canvasBounds);

      if (paletteBounds && canvasBounds) {
        const fromX = paletteBounds.x + paletteBounds.width / 2;
        const fromY = paletteBounds.y + paletteBounds.height / 2;
        const toX = canvasBounds.x + canvasBounds.width / 2;
        const toY = canvasBounds.y + 250;

        console.log(`Dragging from (${fromX}, ${fromY}) to (${toX}, ${toY})`);

        await page.mouse.move(fromX, fromY);
        console.log('  Mouse moved to start');
        
        await page.mouse.down();
        console.log('  Mouse down');
        
        await page.mouse.move(toX, toY, { steps: 10 });
        console.log('  Mouse moved to target');
        
        await page.mouse.up();
        console.log('  Mouse up');

        // Wait and check
        await page.waitForTimeout(1500);
        
        await page.screenshot({ path: 'test-results/debug-after-drag.png', fullPage: true });

        const navigateNode = page.locator('.react-flow__node-navigate');
        const nodeCount = await navigateNode.count();
        console.log(`Navigate nodes after drag: ${nodeCount}`);

        if (nodeCount > 0) {
          console.log('✓✓✓ SUCCESS! Navigate node was added');
          
          const handles = await navigateNode.getByTestId('handle-target').count();
          console.log(`Handle count: ${handles}`);
        } else {
          console.log('✗✗✗ FAILED - Node was not added');
          
          // Debug: what nodes exist?
          const allNodes = await page.locator('.react-flow__node').all();
          console.log(`Total nodes after drag: ${allNodes.length}`);
          
          for (const node of allNodes) {
            const classes = await node.getAttribute('class');
            const text = await node.textContent();
            console.log(`  Node: ${classes} - "${text}"`);
          }
        }
      }
    }
  });
});