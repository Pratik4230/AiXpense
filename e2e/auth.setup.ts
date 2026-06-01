import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set");
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  const signInRequest = page.waitForResponse(
    (res) =>
      res.url().includes("/api/auth/sign-in/email") &&
      res.request().method() === "POST",
  );

  await page.getByRole("button", { name: "Sign in" }).click();
  await signInRequest;

  await expect(page).toHaveURL(/\/aixpense/);

  await page.context().storageState({ path: authFile });
});
