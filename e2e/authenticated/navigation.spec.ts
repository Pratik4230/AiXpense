import { test, expect } from "@playwright/test";

test.describe("Protected navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aixpense");
  });

  test("navbar links to transactions and budgets", async ({ page }) => {
    await page.getByRole("link", { name: "Transactions", exact: true }).click();
    await expect(page).toHaveURL(/\/transactions/);
    await expect(
      page.getByRole("heading", { name: "Transactions" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Budgets", exact: true }).click();
    await expect(page).toHaveURL(/\/budgets/);
    await expect(page.getByRole("heading", { name: "Budgets" })).toBeVisible();
  });

  test("navbar returns to chat from transactions", async ({ page }) => {
    await page.getByRole("link", { name: "Transactions", exact: true }).click();
    await expect(page).toHaveURL(/\/transactions/);

    await page.getByRole("link", { name: "AiXpense", exact: true }).click();
    await expect(page).toHaveURL(/\/aixpense/);
    await expect(page.getByText("What can I help")).toBeVisible();
  });
});
