import { test, expect } from "@playwright/test";

test.describe("Visual – Workflow Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Ensure canvas is ready
    await expect(page.getByTestId("phone-canvas")).toBeVisible({
      timeout: 15000,
    });

    // Select a widget so Inspector + Flow tab is enabled
    await page.getByText("Welcome Back").click();

    // Open Flow tab
    await page.getByLabel("flow tab").click();

    // Ensure workflow editor is mounted
    await expect(page.getByTestId("workflow-editor")).toBeVisible();
  });

  test("default workflow editor", async ({ page }) => {
    const workflow = page.getByTestId("workflow-editor");

    await expect(workflow).toHaveScreenshot("workflow-default.png", {
      animations: "disabled",
    });
  });

  test("workflow editor with nodes", async ({ page }) => {
    // Add nodes (labels depend on your UI)
    await page.getByText("On Tap").click();
    await page.getByText("Navigate").click();

    const workflow = page.getByTestId("workflow-editor");

    await expect(workflow).toHaveScreenshot("workflow-with-nodes.png", {
      animations: "disabled",
    });
  });

  test("workflow editor zoomed state", async ({ page }) => {
    const workflow = page.getByTestId("workflow-editor");

    // Zoom in (ReactFlow listens to wheel events)
    await workflow.hover();
    await page.mouse.wheel(0, -300);

    await expect(workflow).toHaveScreenshot("workflow-zoomed.png", {
      animations: "disabled",
    });
  });
});
