import { test, expect } from "@playwright/test";

test.describe("AiXpense (authenticated)", () => {
  test("loads chat page when logged in", async ({ page }) => {
    await page.goto("/aixpense");

    await expect(page).toHaveURL(/\/aixpense/);
    await expect(page.getByText("What can I help")).toBeVisible();
    await expect(
      page.getByPlaceholder("Coffee 50  or  Salary received 55000"),
    ).toBeVisible();
  });

  test("guest cannot access chat — redirected to login", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/aixpense");
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });
});
