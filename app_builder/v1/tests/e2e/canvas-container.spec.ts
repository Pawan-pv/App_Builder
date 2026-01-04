import { test, expect } from "@playwright/test";

test.describe("Canvas – Containers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("phone-canvas")).toBeVisible({ timeout: 15000 });
  });

  test("should add a widget inside a Column container", async ({ page }) => {
    const canvas = page.getByTestId("phone-canvas-inner");

    await page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="phone-canvas-inner"]') as HTMLElement;
      const dt = new DataTransfer();
      dt.setData("widgetType", "Column");
      dt.setData("draggedWidgetId", "");

      canvas.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
      canvas.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
    });

    await page.waitForTimeout(400);

    const column = canvas.getByTestId("widget-Column").last();
    await expect(column).toBeVisible();

    await page.evaluate(() => {
      const column = document.querySelector('[data-testid="widget-Column"]') as HTMLElement;
      const dt = new DataTransfer();
      dt.setData("widgetType", "Button");
      dt.setData("draggedWidgetId", "");

      column.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
      column.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
    });

    await page.waitForTimeout(300);

    await expect(column.getByTestId("widget-Button")).toBeVisible();
  });

  test("should add multiple widgets inside a Row container", async ({ page }) => {
    const canvas = page.getByTestId("phone-canvas-inner");

    await page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="phone-canvas-inner"]') as HTMLElement;
      const dt = new DataTransfer();
      dt.setData("widgetType", "Row");
      dt.setData("draggedWidgetId", "");

      canvas.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
      canvas.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
    });

    await page.waitForTimeout(300);

    const row = canvas.getByTestId("widget-Row").last();
    await expect(row).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        const row = document.querySelector('[data-testid="widget-Row"]') as HTMLElement;
        const dt = new DataTransfer();
        dt.setData("widgetType", "Button");
        dt.setData("draggedWidgetId", "");

        row.dispatchEvent(new DragEvent("dragover", { dataTransfer: dt, bubbles: true }));
        row.dispatchEvent(new DragEvent("drop", { dataTransfer: dt, bubbles: true }));
      });
      await page.waitForTimeout(200);
    }

    expect(await row.getByTestId("widget-Button").count()).toBe(2);
  });
});
