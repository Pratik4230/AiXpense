import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and show AiXpense branding", async ({ page }) => {
    await page.goto("/");

    await expect(
      page
        .locator("header")
        .getByRole("link", { name: "AiXpense", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator("header")
        .getByRole("link", { name: "Get Started", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("AI assistant for expenses & income"),
    ).toBeVisible();
  });
});
