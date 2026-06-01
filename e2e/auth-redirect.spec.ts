import { test, expect } from "@playwright/test";

test.describe("Auth redirect", () => {
  test("Get Started sends unauthenticated user to login", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("header")
      .getByRole("link", { name: "Get Started", exact: true })
      .click();

    // SmartLink points to /aixpense; proxy.ts redirects guests to /login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("login page shows email form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
