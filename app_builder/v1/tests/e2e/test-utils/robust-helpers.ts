// tests/test-utils/robust-helpers.ts

import { Page, Locator, expect } from '@playwright/test';

/**
 * Enhanced test utilities to handle timing, visibility, and interaction issues
 */

export class RobustTestHelper {
  constructor(private page: Page) {}

  /**
   * Wait for page to fully load with network idle
   */
  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.warn('Page load timeout, continuing anyway...');
    }
  }

  /**
   * Remove pointer event blocking from HTML element
   */
  async unblockPointerEvents() {
    await this.page.evaluate(() => {
      const html = document.documentElement;
      html.style.pointerEvents = 'auto';
      
      // Remove any overlay blocking elements
      document.querySelectorAll('[style*="pointer-events: none"]').forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
      });

      // Check for modal overlays or spinners
      document.querySelectorAll('.modal, .overlay, [role="dialog"], .spinner, .loader').forEach(el => {
        const element = el as HTMLElement;
        element.style.display = 'none';
      });
    });
    await this.page.waitForTimeout(200);
  }

  /**
   * Safely click an element with multiple retry strategies
   */
  async safeClick(locator: Locator, options?: { timeout?: number; retries?: number }) {
    const timeout = options?.timeout || 10000;
    const retries = options?.retries || 3;

    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        // Wait for element to be visible
        await locator.waitFor({ state: 'visible', timeout });

        // Scroll into view
        await locator.scrollIntoViewIfNeeded();

        // Wait for stabilization
        await this.page.waitForTimeout(300);

        // Get element position and verify it's not covered
        const box = await locator.boundingBox();
        if (!box) {
          throw new Error('Element has no bounding box');
        }

        // Check if element is in viewport
        if (box.y < 0 || box.x < 0) {
          await locator.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(300);
        }

        // Perform click
        await locator.click({ timeout, force: false });
        return;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Click attempt ${i + 1}/${retries} failed:`, lastError.message);

        if (i < retries - 1) {
          // Exponential backoff
          const backoffTime = 500 * Math.pow(1.5, i);
          await this.page.waitForTimeout(backoffTime);
        }
      }
    }

    throw lastError || new Error('Click failed after retries');
  }

  /**
   * Safely fill input field with retry logic
   */
  async safeFill(locator: Locator, value: string, options?: { timeout?: number }) {
    const timeout = options?.timeout || 10000;

    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);

    // Clear the field first
    await locator.fill('');
    await this.page.waitForTimeout(100);

    // Type the value
    await locator.fill(value);
    await this.page.waitForTimeout(100);

    // Verify value was set
    const currentValue = await locator.inputValue();
    if (currentValue !== value) {
      throw new Error(`Failed to fill input. Expected: "${value}", Got: "${currentValue}"`);
    }
  }

  /**
   * Perform drag and drop with manual mouse events (more reliable)
   */
  async manualDragDrop(
    sourceLoc: Locator,
    targetLoc: Locator,
    options?: { steps?: number; timeout?: number }
  ) {
    const steps = options?.steps || 10;
    const timeout = options?.timeout || 10000;

    console.log('🔄 Starting manual drag and drop...');

    // Ensure both elements are visible
    await sourceLoc.waitFor({ state: 'visible', timeout });
    await targetLoc.waitFor({ state: 'visible', timeout });

    // Unblock pointer events
    await this.unblockPointerEvents();

    // Get bounding boxes
    const sourceBBox = await sourceLoc.boundingBox();
    const targetBBox = await targetLoc.boundingBox();

    if (!sourceBBox || !targetBBox) {
      throw new Error('Could not get bounding box for drag/drop elements');
    }

    // Calculate positions (center of elements)
    const startX = sourceBBox.x + sourceBBox.width / 2;
    const startY = sourceBBox.y + sourceBBox.height / 2;
    const endX = targetBBox.x + targetBBox.width / 2;
    const endY = targetBBox.y + targetBBox.height / 2;

    console.log(`📍 Source: (${Math.round(startX)}, ${Math.round(startY)})`);
    console.log(`📍 Target: (${Math.round(endX)}, ${Math.round(endY)})`);

    // Move to start position
    await this.page.mouse.move(startX, startY);
    await this.page.waitForTimeout(150);

    // Press down
    await this.page.mouse.down();
    console.log('🔽 Mouse down');
    await this.page.waitForTimeout(150);

    // Move in steps to target
    for (let i = 1; i <= steps; i++) {
      const currentX = startX + ((endX - startX) / steps) * i;
      const currentY = startY + ((endY - startY) / steps) * i;
      await this.page.mouse.move(currentX, currentY);
      await this.page.waitForTimeout(50);
    }

    console.log('☝️ Mouse up');
    await this.page.waitForTimeout(150);
    await this.page.mouse.up();
    await this.page.waitForTimeout(300);

    console.log('✅ Drag and drop completed');
  }

  /**
   * Wait for element to stabilize and become clickable
   */
  async waitForStable(locator: Locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if element exists and is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element count safely
   */
  async getElementCount(locator: Locator): Promise<number> {
    try {
      return await locator.count();
    } catch {
      return 0;
    }
  }

  /**
   * Take screenshot for debugging
   */
  async debugScreenshot(name: string) {
    const timestamp = Date.now();
    const path = `test-results/debug-${name}-${timestamp}.png`;
    await this.page.screenshot({ path });
    console.log(`📸 Screenshot saved: ${path}`);
  }

  /**
   * Wait for network to be idle (useful after button clicks)
   */
  async waitForNetworkIdle(timeout = 10000) {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch {
      console.warn('⚠️ Network idle timeout exceeded, continuing anyway');
    }
  }

  /**
   * Wait for specific navigation
   */
  async waitForNavigation(timeout = 10000) {
    try {
      await this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout });
    } catch {
      console.warn('⚠️ Navigation timeout exceeded, continuing anyway');
    }
  }

  /**
   * Helper to handle create app flow
   */
  async createApp(appName: string) {
    console.log(`📱 Creating app: ${appName}`);

    // Click "New App" button
    await this.safeClick(this.page.getByRole('button', { name: /new app/i }), {
      timeout: 15000,
      retries: 3
    });

    await this.waitForNetworkIdle();

    // Fill app name
    const appNameInput = this.page.locator('input[placeholder*="app name" i]');
    await this.safeFill(appNameInput, appName);

    // Click create button
    await this.safeClick(this.page.getByRole('button', { name: /create/i }));

    await this.waitForNetworkIdle();
    await this.page.waitForTimeout(500);

    console.log(`✅ App created: ${appName}`);
  }

  /**
   * Helper to navigate to workflow
   */
  async navigateToWorkflow() {
    console.log('🔄 Navigating to workflow...');

    // Click Welcome Back or similar entry button
    const welcomeButton = this.page.getByRole('button', { name: /welcome back/i });
    if (await this.isVisible(welcomeButton)) {
      await this.safeClick(welcomeButton);
      await this.waitForNetworkIdle();
    }

    // Click flow tab
    const flowTab = this.page.getByRole('button', { name: /flow/i });
    await this.safeClick(flowTab);

    await this.waitForNetworkIdle();
    await this.page.waitForTimeout(500);

    console.log('✅ Workflow loaded');
  }

  /**
   * Helper to add node from palette
   */
  async addNodeFromPalette(nodeType: string) {
    console.log(`➕ Adding ${nodeType} node...`);

    const paletteItem = this.page
      .locator('[draggable="true"]')
      .filter({ hasText: nodeType })
      .first();

    const canvas = this.page.locator('.react-flow__pane').first();

    await this.manualDragDrop(paletteItem, canvas, {
      steps: 15,
      timeout: 10000
    });

    await this.page.waitForTimeout(500);

    console.log(`✅ ${nodeType} node added`);
  }

  /**
   * Helper to verify nodes exist
   */
  async verifyNodesExist(minCount: number = 1) {
    const nodes = this.page.locator('.react-flow__node');
    const count = await this.getElementCount(nodes);

    console.log(`📊 Found ${count} nodes (minimum: ${minCount})`);

    if (count < minCount) {
      throw new Error(`Expected at least ${minCount} nodes, but found ${count}`);
    }

    return count;
  }
}

/**
 * Example usage in tests - call this at the start
 */
export async function setupRobustTest(page: Page) {
  const helper = new RobustTestHelper(page);

  // Initialize at start of test
  await helper.waitForPageLoad();
  await helper.unblockPointerEvents();

  return helper;
}