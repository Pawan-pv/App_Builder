import { test, expect } from "@playwright/test";

test.describe("Canvas – Drag & Drop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("phone-canvas")).toBeVisible({ timeout: 15000 });
  });

  test("should be able to drag a new widget to the canvas", async ({ page }) => {
    const paletteItem = page.getByTestId("palette-item-Button");
    const canvas = page.getByTestId("phone-canvas-inner");

    await expect(paletteItem).toBeVisible();
    await expect(canvas).toBeVisible();

    const initialCount = await canvas.getByTestId("widget-Button").count();

    await page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="phone-canvas-inner"]') as HTMLElement;
      const dt = new DataTransfer();
      dt.setData("widgetType", "Button");
      dt.setData("draggedWidgetId", "");

      canvas.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
      canvas.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
    });

    await page.waitForTimeout(300);

    const finalCount = await canvas.getByTestId("widget-Button").count();
    expect(finalCount).toBe(initialCount + 1);

    await expect(canvas.getByTestId("widget-Button").last()).toBeVisible();
  });

  test("newly added button should be selectable", async ({ page }) => {
    const canvas = page.getByTestId("phone-canvas-inner");

    await page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="phone-canvas-inner"]') as HTMLElement;
      const dt = new DataTransfer();
      dt.setData("widgetType", "Button");
      dt.setData("draggedWidgetId", "");

      canvas.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
      canvas.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
    });

    await page.waitForTimeout(300);

    const newButton = canvas.getByTestId("widget-Button").last();
    await newButton.click();

    await expect(page.getByTestId("property-panel")).toContainText("Button");
  });
});
