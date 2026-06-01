import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aixpense");
    await expect(page.getByText("What can I help")).toBeVisible();
  });

  test("suggestion chip sends a user message", async ({ page }) => {
    await page.getByRole("button", { name: "Coffee 120", exact: true }).click();

    await expect(page.getByText("Coffee 120").first()).toBeVisible();
    await expect(page.getByText("What can I help")).not.toBeVisible();
  });

  test("user can type and submit a message", async ({ page }) => {
    const message = "Uber 650";

    await page.getByPlaceholder("Coffee 50  or  Salary received 55000").fill(message);
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(message).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
