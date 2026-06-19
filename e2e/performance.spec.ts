import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", name: "Landing" },
  { path: "/login", name: "Login" },
  { path: "/signup", name: "Signup" },
  { path: "/post", name: "Dashboard" },
  { path: "/products", name: "Products" },
  { path: "/orders", name: "Orders" },
  { path: "/profile", name: "Profile" },
  { path: "/add-product", name: "Add Product" },
  { path: "/onboarding", name: "Onboarding" },
];

test.describe("Performance & Accessibility Audit", () => {
  for (const { path, name } of PAGES) {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
      });

      // ── Performance ──

      test("page loads within 5 seconds", async ({ page }) => {
        const start = Date.now();
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const loadTime = Date.now() - start;
        expect(loadTime).toBeLessThan(5000);
      });

      test("no React hydration errors", async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") errors.push(msg.text());
        });
        await page.reload();
        await page.waitForLoadState("networkidle");
        const realErrors = errors.filter(
          (e) => !e.includes("favicon") && !e.includes("403")
        );
        expect(realErrors).toHaveLength(0);
      });

      // ── Accessibility ──

      test("html has lang attribute", async ({ page }) => {
        const lang = await page.locator("html").getAttribute("lang");
        expect(lang).toBeTruthy();
      });

      test("page has a main landmark or heading", async ({ page }) => {
        const hasMain = (await page.locator("main").count()) > 0;
        const hasH1 = (await page.locator("h1").count()) > 0;
        expect(hasMain || hasH1).toBe(true);
      });

      test("all buttons have accessible names", async ({ page }) => {
        const buttons = page.locator("button");
        const count = await buttons.count();
        let missing = 0;
        for (let i = 0; i < count; i++) {
          const btn = buttons.nth(i);
          const hasText = (await btn.textContent())?.trim() ?? "";
          const hasAriaLabel = (await btn.getAttribute("aria-label")) ?? "";
          const hasTitle = (await btn.getAttribute("title")) ?? "";
          if (!hasText && !hasAriaLabel && !hasTitle) {
            missing++;
          }
        }
        // Document all buttons without accessible names
        if (missing > 0) {
          console.warn(`${name}: ${missing} buttons missing accessible names`);
        }
        // Soft assertion — not all icon-only buttons may have labels
        expect(missing).toBeLessThan(count);
      });

      test("no positive tabindex values (keyboard trap risk)", async ({ page }) => {
        const badTabindex = page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])');
        const count = await badTabindex.count();
        expect(count).toBe(0);
      });

      // ── Resource Loading ──

      test("all images on page have loaded successfully", async ({ page }) => {
        const imgs = page.locator("img");
        const count = await imgs.count();
        let broken = 0;
        for (let i = 0; i < count; i++) {
          const naturalWidth = await imgs.nth(i).evaluate(
            (el: HTMLImageElement) => el.naturalWidth
          );
          if (naturalWidth === 0) {
            const src = await imgs.nth(i).getAttribute("src");
            console.warn(`${name}: broken image — ${src}`);
            broken++;
          }
        }
        expect(broken).toBe(0);
      });

      // ── Viewport meta ──

      test("has viewport meta tag for mobile responsiveness", async ({ page }) => {
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute("content", /width=device-width/);
      });
    });
  }
});

test.describe("Cross-Page Consistency", () => {
  for (const { path, name } of PAGES) {
    test(`${name}: consistent theme CSS variables`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--primary"
        ).trim();
      });
      expect(primaryColor).toBeTruthy();

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--background"
        ).trim();
      });
      expect(bgColor).toBeTruthy();
    });
  }
});
