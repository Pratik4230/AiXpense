import { test, expect } from "@playwright/test";

test.describe("Login form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("can fill email and password fields", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");

    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByLabel("Password")).toHaveValue("password123");
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("invalid@test.com");
    await page.getByLabel("Password").fill("wrongpassword123");

    const signInRequest = page.waitForResponse(
      (res) =>
        res.url().includes("/api/auth/sign-in/email") &&
        res.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Sign in" }).click();
    await signInRequest;

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled();
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("Sign up link navigates to signup page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();

    await expect(page).toHaveURL(/\/signup/);
  });
});
