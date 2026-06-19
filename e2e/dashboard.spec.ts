import { test, expect } from "@playwright/test";

test.describe("Post-Login Dashboard (/post)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/post");
    await page.waitForLoadState("networkidle");
  });

  test("loads with title", async ({ page }) => {
    await expect(page).toHaveTitle(/Post/);
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("sidebar navigation renders", async ({ page }) => {
    const nav = page.locator("nav, aside, [role='navigation']").first();
    await expect(nav).toBeVisible();
  });

  test('sidebar "Products" link navigates to /products', async ({ page }) => {
    const productsLink = page.locator('a[href="/products"]');
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('sidebar "Orders" link navigates to /orders', async ({ page }) => {
    const ordersLink = page.locator('a[href="/orders"]');
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
      await expect(page).toHaveURL(/\/orders/);
    }
  });

  test("page renders heading content", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("Products Page (/products)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");
  });

  test("loads with title", async ({ page }) => {
    await expect(page).toHaveTitle(/Products/);
  });

  test("has filter buttons", async ({ page }) => {
    await expect(page.locator("button", { hasText: "All" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Active" })).toBeVisible();
  });

  test("filter buttons toggle active state", async ({ page }) => {
    const draftBtn = page.locator("button", { hasText: "Draft" });
    await draftBtn.click();
    await expect(draftBtn).toHaveClass(/primary/);
  });

  test("search input filters products", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("xyz_nonexistent_product");
    await expect(page.locator("text=No products match")).toBeVisible();
  });

  test('"Add product" button navigates to /add-product', async ({ page }) => {
    await page.locator('a[href="/add-product"]').click();
    await expect(page).toHaveURL(/\/add-product/);
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });
});

test.describe("Orders Page (/orders)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");
  });

  test("loads with title", async ({ page }) => {
    await expect(page).toHaveTitle(/Orders/);
  });

  test("shows order rows", async ({ page }) => {
    const rows = page.locator("li", { has: page.locator("text=IH-") });
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });
});

test.describe("Profile Page (/profile)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
  });

  test("loads with title", async ({ page }) => {
    await expect(page).toHaveTitle(/Profile/);
  });

  test("shows seller initials avatar", async ({ page }) => {
    await expect(page.locator(".rounded-full").first()).toBeVisible();
  });

  test("shows business details", async ({ page }) => {
    await expect(page.locator("text=Business details")).toBeVisible();
  });

  test("shows recognitions section", async ({ page }) => {
    await expect(page.locator("text=Recognitions")).toBeVisible();
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });
});
