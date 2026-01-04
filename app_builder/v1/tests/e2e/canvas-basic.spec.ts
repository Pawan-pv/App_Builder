import { test, expect } from "@playwright/test";

test.describe("Canvas – Basic Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("phone-canvas")).toBeVisible({ timeout: 15000 });
  });

  test("should select a widget on click", async ({ page }) => {
    const canvas = page.getByTestId("phone-canvas-inner");
    const textWidget = canvas.getByTestId("widget-Text").first();

    const count = await canvas.getByTestId("widget-Text").count();
    if (count === 0) {
      test.skip();
      return;
    }

    await expect(textWidget).toBeVisible();
    await textWidget.click();

    const inspector = page.getByTestId("property-panel");
    await expect(inspector).toBeVisible();
    await expect(inspector).toContainText("Inspector");
    await expect(inspector.getByText("Content Text")).toBeVisible();

    await page.getByLabel("style tab").click();
    await expect(inspector.getByText("Colors")).toBeVisible();
  });
});
