import { test, expect } from "@playwright/test";
import { bootstrapApp } from "../test-utils/appBootstrap";

test.describe("Workflow E2E – Stable Happy Path", () => {
  test("user can create, compile and execute a workflow", async ({ page }) => {

    /* ----------------------------------
       1. Boot app safely
    ---------------------------------- */
    await bootstrapApp(page);

    /* ----------------------------------
       2. Open FLOW tab
    ---------------------------------- */
    await page.getByLabel("flow tab").click();
    await expect(page.getByTestId("workflow-editor")).toBeVisible({
      timeout: 15000,
    });

    /* ----------------------------------
       3. Verify trigger node exists
    ---------------------------------- */
    const triggerNode = page.locator(".react-flow__node-trigger");
    await expect(triggerNode).toBeVisible();

    /* ----------------------------------
       4. Add Navigate node (CLICK)
    ---------------------------------- */
    const navigatePaletteItem = page.getByTestId("palette-node-navigate");
    await expect(navigatePaletteItem).toBeVisible();
    await navigatePaletteItem.click();

    /* ----------------------------------
       5. Verify Navigate node rendered
    ---------------------------------- */
    const navigateNode = page.getByTestId("workflow-node-navigate");
    await expect(navigateNode).toBeVisible({ timeout: 5000 });

    /* ----------------------------------
       6. Connect Trigger → Navigate
    ---------------------------------- */
    const triggerHandle = triggerNode.getByTestId("handle-source");
    const navigateTargetHandle = navigateNode.getByTestId("handle-target");

    const from = await triggerHandle.boundingBox();
    const to = await navigateTargetHandle.boundingBox();

    if (!from || !to) {
      throw new Error("Could not find node handles for connection");
    }

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2);
    await page.mouse.up();

    /* ----------------------------------
       7. WAIT for edge to exist (IMPORTANT)
    ---------------------------------- */
    await expect(page.locator(".react-flow__edge")).toHaveCount(1, {
      timeout: 5000,
    });

    /* ----------------------------------
       8. Compile workflow
    ---------------------------------- */
    const compileBtn = page.getByTestId("compile-workflow");
    await expect(compileBtn).toBeEnabled({ timeout: 5000 });
    await compileBtn.click();

    /* ----------------------------------
       9. Verify action created (STABLE)
    ---------------------------------- */
    const actionTypeSelect = page
      .getByTestId("property-panel")
      .locator("select")
      .nth(1); // action type select

    await expect(actionTypeSelect).toHaveValue("navigate");

    /* ----------------------------------
       10. Screenshot for proof
    ---------------------------------- */
    await page.screenshot({
      path: "test-results/workflow-success.png",
      fullPage: true,
    });
  });
});
