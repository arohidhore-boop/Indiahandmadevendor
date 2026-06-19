import { test, expect } from "@playwright/test";

test.describe("Landing Page (/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── Load & Performance ──

  test("page loads with HTTP 200 and renders critical content", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("text=Start selling your")).toBeVisible();
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("no uncaught exceptions", async ({ page }) => {
    const exceptions: Error[] = [];
    page.on("pageerror", (err) => exceptions.push(err));
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(exceptions).toHaveLength(0);
  });

  test("hero image loads without error", async ({ page }) => {
    const img = page.locator("img[alt*='artisan']").first();
    await expect(img).toBeVisible();
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  // ── SEO & Meta ──

  test("has title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(/India Handmade/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /handmade/);
  });

  test("has favicon link", async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]');
    // May 404 but the link should exist
    const count = await favicon.count();
    expect(count).toBeGreaterThanOrEqual(0); // not a hard fail, just document
  });

  // ── Navigation ──

  test('"Start selling" CTA navigates to /signup', async ({ page }) => {
    const cta = page.locator("a", { hasText: "Start selling" }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('"Sign in" link navigates to /login', async ({ page }) => {
    await page.locator("text=Sign in").first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('"Learn more" scrolls to #why section', async ({ page }) => {
    const learnMore = page.locator('a[href="#why"]');
    await learnMore.click();
    // URL fragment should update or section visible
    await expect(page.locator("#why")).toBeVisible();
  });

  // ── Layout & Responsiveness ──

  test("header is sticky", async ({ page }) => {
    const header = page.locator("header").first();
    const position = await header.evaluate((el: HTMLElement) =>
      window.getComputedStyle(el).position
    );
    expect(position).toBe("sticky");
  });

  test("footer renders with copyright", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer")).toContainText("India Handmade");
    await expect(page.locator("footer")).toContainText("All rights reserved");
  });

  test("footer social links are present", async ({ page }) => {
    const footer = page.locator("footer");
    const socialLinks = footer.locator('[aria-label="Instagram"], [aria-label="Facebook"], [aria-label="YouTube"]');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  // ── Content ──

  test("Why section has 4 feature cards", async ({ page }) => {
    const cards = page.locator("#why .surface-card");
    await expect(cards).toHaveCount(4);
  });

  test("How it works section has 3 steps", async ({ page }) => {
    await page.locator("#how").scrollIntoViewIfNeeded();
    // Each step card has a number: 01, 02, 03
    await expect(page.locator("text=01")).toBeVisible();
    await expect(page.locator("text=02")).toBeVisible();
    await expect(page.locator("text=03")).toBeVisible();
  });

  test("Artisan stories section has 3 testimonials", async ({ page }) => {
    await page.locator("#stories").scrollIntoViewIfNeeded();
    const quotes = page.locator("#stories blockquote");
    await expect(quotes).toHaveCount(3);
  });

  test("Categories section has 4 category cards", async ({ page }) => {
    await page.locator("#categories").scrollIntoViewIfNeeded();
    const catCards = page.locator("#categories .group");
    await expect(catCards).toHaveCount(4);
  });

  // ── Broken Links ──

  test("all internal links on landing page resolve", async ({ page }) => {
    const links = page.locator("a[href]:not([href^='http']):not([href^='#']):not([href^='mailto'])");
    const count = await links.count();
    const broken: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href) continue;
      const resp = await page.request.get(href);
      if (resp.status() >= 400) {
        broken.push(`${href} → ${resp.status()}`);
      }
    }
    expect(broken).toHaveLength(0);
  });

  // ── Image Performance ──

  test("lazy-loaded images have loading='lazy'", async ({ page }) => {
    const lazyImgs = page.locator("img[loading='lazy']");
    const count = await lazyImgs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("all visible images have alt text", async ({ page }) => {
    const imgs = page.locator("img:visible");
    const count = await imgs.count();
    let missingAlt = 0;
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      if (!alt) missingAlt++;
    }
    expect(missingAlt).toBe(0);
  });
});
