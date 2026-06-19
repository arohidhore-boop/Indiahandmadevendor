import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test.describe("/login", () => {
    test.beforeEach(async ({ page }) => { await page.goto("/login"); });

    test("loads with title", async ({ page }) => {
      await expect(page).toHaveTitle(/Sign in/);
    });

    test("has email and password fields", async ({ page }) => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test("password toggle exists and clickable", async ({ page }) => {
      const toggle = page.locator('button[aria-label="Show password"]');
      await expect(toggle).toBeVisible();
      await toggle.click();
    });

    test("forgot password button clickable", async ({ page }) => {
      const btn = page.locator("button", { hasText: "Forgot password?" });
      await expect(btn).toBeVisible();
      await btn.click();
    });

    test("has functional Sign In button", async ({ page }) => {
      await expect(page.locator("button", { hasText: "Sign In" })).toBeVisible();
    });

    test("Create account → /signup", async ({ page }) => {
      await page.locator("text=Create an account").click();
      await expect(page).toHaveURL(/\/signup/);
    });

    test("no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
      await page.reload();
      await page.waitForLoadState("networkidle");
      expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
    });
  });

  test.describe("/signup", () => {
    test.beforeEach(async ({ page }) => { await page.goto("/signup"); });

    test("loads with title", async ({ page }) => {
      await expect(page).toHaveTitle(/Create account/);
    });

    test("has name, email, password fields", async ({ page }) => {
      await expect(page.locator('input[type="text"]')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toHaveCount(2);
    });

    test("social login buttons disabled", async ({ page }) => {
      await expect(page.locator("text=Social login coming soon")).toBeVisible();
      await expect(page.locator("button", { hasText: /Google/ })).toBeDisabled();
    });

    test("Sign in link → /login", async ({ page }) => {
      await page.locator("text=Sign in").first().click();
      await expect(page).toHaveURL(/\/login/);
    });

    test("no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
      await page.reload();
      await page.waitForLoadState("networkidle");
      expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
    });
  });
});
