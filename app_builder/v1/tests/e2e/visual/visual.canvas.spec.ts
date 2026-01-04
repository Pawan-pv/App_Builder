import { test, expect } from "@playwright/test";

test.describe("Visual – Canvas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("phone-canvas")).toBeVisible();
  });

  test("default canvas", async ({ page }) => {
    const canvas = page.getByTestId("phone-canvas");
    await expect(canvas).toHaveScreenshot("canvas-default.png", {
      animations: "disabled",
    });
  });

  test("zoomed canvas", async ({ page }) => {
    await page.mouse.wheel(0, -300);
    const canvas = page.getByTestId("phone-canvas");
    await expect(canvas).toHaveScreenshot("canvas-zoomed.png", {
      animations: "disabled",
    });
  });
});
