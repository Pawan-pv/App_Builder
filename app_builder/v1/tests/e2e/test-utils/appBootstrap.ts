import { type Page, expect } from "@playwright/test";

export async function bootstrapApp(page: Page) {
  // Hard reset browser state
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  // Wait for app shell
  await expect(page.getByText(/FlowStudio/i)).toBeVisible({
    timeout: 15000,
  });

  const newAppBtn = page.getByRole("button", { name: /new app/i });
  const welcomeBtn = page.getByText("Welcome Back");

  if (await newAppBtn.isVisible()) {
    await newAppBtn.click();
  } else if (await welcomeBtn.isVisible()) {
    await welcomeBtn.click();
  } else {
    throw new Error("No valid entry button found");
  }
}
