import { test, expect } from "@playwright/test";

test.describe("Public routes", () => {
  const routes = ["/", "/login", "/signup"] as const;
  for (const path of routes) {
    test(`${path} loads`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});

test.describe("Landing page (/)", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("CTA → /signup", async ({ page }) => {
    await page.locator("a", { hasText: "Start selling" }).first().click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("Learn more → scrolls to #why", async ({ page }) => {
    await page.locator('a[href="#why"]').click();
    await expect(page.locator("#why")).toBeInViewport();
  });

  test("header Sign in → /login", async ({ page }) => {
    await page.locator("header").getByText("Sign in").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("4 category cards", async ({ page }) => {
    await page.locator("#categories").scrollIntoViewIfNeeded();
    await expect(page.locator("#categories .group")).toHaveCount(4);
  });

  test("3 artisan testimonials", async ({ page }) => {
    await page.locator("#stories").scrollIntoViewIfNeeded();
    await expect(page.locator("#stories blockquote")).toHaveCount(3);
  });

  test("mobile hamburger menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    // The desktop link is hidden on mobile (hidden sm:inline-flex), so use last() for the mobile dropdown one
    await expect(page.locator("a[href='/signup'].ih-btn-primary").last()).toBeVisible({ timeout: 3000 });
    await page.locator('button[aria-label="Close menu"]').click();
  });
});

test.describe("Login page (/login)", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/login"); });

  test("fields present", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("password toggle button exists and is clickable", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Show password" });
    await expect(toggle).toBeVisible();
    await toggle.click();
  });

  test("forgot password clickable", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Forgot password?" });
    await expect(btn).toBeVisible();
    await btn.click();
  });

  test("Create account → /signup", async ({ page }) => {
    await page.getByText("Create an account").click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("Signup page (/signup)", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/signup"); });

  test("fields present", async ({ page }) => {
    await expect(page.getByPlaceholder("Your full name")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
  });

  test("social buttons disabled", async ({ page }) => {
    await expect(page.getByText("Social login coming soon")).toBeVisible();
    await expect(page.getByRole("button", { name: /Google/ })).toBeDisabled();
  });

  test("independent password toggles exist", async ({ page }) => {
    const toggles = page.locator('button[aria-label="Show password"]');
    await expect(toggles).toHaveCount(2);
  });

  test("Sign in link → /login", async ({ page }) => {
    await page.locator('a[href="/login"]').last().click();
    await page.waitForURL(/\/login/, { timeout: 5000 });
  });
});

test.describe("Auth flow: signup wizard", () => {
  test("full signup → dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByPlaceholder("Your full name").fill("Priya Sharma");
    await page.locator('input[type="email"]').fill("priya@example.in");
    const pwds = page.locator('input[type="password"]');
    await pwds.first().fill("demodemo");
    await pwds.nth(1).fill("demodemo");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForURL(/\/verify/, { timeout: 10000 });

    await expect(page.getByText("Verify your email")).toBeVisible();
    const otp = page.locator('input[maxlength="1"]');
    for (let i = 0; i < 6; i++) await otp.nth(i).fill(String(i + 1));
    await page.getByRole("button", { name: "Verify and continue" }).click();
    await expect(page).toHaveURL(/\/seller-type/);

    await expect(page.getByText("What kind of seller")).toBeVisible();
    await page.getByRole("button", { name: /Individual artisan/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/details/);

    await expect(page.getByText("Tell us about your business")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL(/\/post/, { timeout: 10000 });
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("Dashboard sidebar navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/post");
    await page.waitForLoadState("networkidle");
  });

  const links = ["Dashboard","Products","Orders","Earnings","Grow","Help"] as const;
  const urls: Record<string,string> = { Dashboard:"/post", Products:"/products", Orders:"/orders", Earnings:"/earnings", Grow:"/grow", Help:"/help" };
  for (const label of links) {
    test(`${label} → ${urls[label]}`, async ({ page }) => {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(urls[label].replace("/","\\/")));
    });
  }
});

test.describe("Products filters + search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");
  });

  for (const f of ["All","Active","Draft","Under review","Out of stock"]) {
    test(`filter: ${f}`, async ({ page }) => {
      await page.getByRole("button", { name: f, exact: true }).click();
      await expect(page.getByRole("button", { name: f, exact: true })).toHaveClass(/primary/);
    });
  }

  test("search finds product", async ({ page }) => {
    await page.getByPlaceholder("Search products").fill("Banarasi");
    await expect(page.getByText("Hand-woven Banarasi Dupatta")).toBeVisible();
    await expect(page.getByText("Blue Pottery")).not.toBeVisible();
  });

  test("search empty shows message", async ({ page }) => {
    await page.getByPlaceholder("Search products").fill("xyznonexistent12345");
    await expect(page.getByText(/No products match/)).toBeVisible();
  });

  test("Add product → /add-product", async ({ page }) => {
    await page.locator('a[href="/add-product"]').click();
    await expect(page).toHaveURL(/\/add-product/);
  });
});

test.describe("Add Product flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/add-product");
    await page.waitForLoadState("networkidle");
  });

  test("step 1 shows Photos + nav buttons", async ({ page }) => {
    await expect(page.getByText("Showcase")).toBeVisible();
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Continue/ })).toBeVisible();
  });

  test("Continue advances to step 2", async ({ page }) => {
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.waitForTimeout(500);
    const onStep2 = await page.getByText("Category").or(page.getByText("Basic Info")).first().isVisible().catch(() => false);
    expect(onStep2).toBe(true);
  });
});

test.describe("Orders page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");
  });

  test("5 order rows", async ({ page }) => {
    await expect(page.locator("li", { has: page.locator("text=IH-") })).toHaveCount(5);
  });

  test("all statuses visible", async ({ page }) => {
    for (const s of ["New","Packed","Shipped","Delivered"]) {
      await expect(page.getByText(s, { exact: true }).first()).toBeVisible();
    }
  });

  test("Ship buttons on each row", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Ship" })).toHaveCount(5);
  });
});

test.describe("Earnings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/earnings");
    await page.waitForLoadState("networkidle");
  });

  test("revenue shown", async ({ page }) => {
    await expect(page.getByText("This month")).toBeVisible();
    await expect(page.getByText("24,560")).toBeVisible();
  });

  test("chart SVG present", async ({ page }) => {
    await expect(page.locator('svg[viewBox="0 0 600 200"]')).toBeVisible();
  });

  test("4 payout entries", async ({ page }) => {
    await expect(page.locator("li", { has: page.locator("text=HDFC") })).toHaveCount(4);
  });
});

test.describe("Grow page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/grow");
    await page.waitForLoadState("networkidle");
  });

  test("3 tip cards", async ({ page }) => {
    await expect(page.locator("article")).toHaveCount(3);
  });

  test("tags: Trust, Marketing, Recognition", async ({ page }) => {
    for (const tag of ["Trust","Marketing","Recognition"]) {
      await expect(page.getByText(tag, { exact: true })).toBeVisible();
    }
  });
});

test.describe("Help page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/help");
    await page.waitForLoadState("networkidle");
  });

  test("4 FAQs", async ({ page }) => {
    await expect(page.locator("button .font-medium")).toHaveCount(4);
  });

  test("FAQ accordion clickable", async ({ page }) => {
    const faqBtn = page.getByText("How do I add my first product?");
    await expect(faqBtn).toBeVisible();
    await faqBtn.click();
  });

  test("helpline + contact form", async ({ page }) => {
    await expect(page.getByText("1800-270-0400")).toBeVisible();
    await expect(page.getByPlaceholder("Subject")).toBeVisible();
    await expect(page.getByPlaceholder("How can we help?")).toBeVisible();
  });
});

test.describe("Profile page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
  });

  test("avatar + business details", async ({ page }) => {
    await expect(page.locator(".rounded-full").first()).toBeVisible();
    await expect(page.getByText("Business details")).toBeVisible();
  });

  test("story textarea + recognitions", async ({ page }) => {
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.getByText("Recognitions")).toBeVisible();
  });
});

test.describe("GST page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/gst");
    await page.waitForLoadState("networkidle");
  });

  test("Yes/No/Skip buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Yes", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "No", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Skip for now" })).toBeVisible();
  });

  test("Yes → GSTIN input", async ({ page }) => {
    await page.getByRole("button", { name: "Yes", exact: true }).click();
    await expect(page.getByPlaceholder(/22AAAAA0000A1Z5/)).toBeVisible();
  });

  test("No → EID input", async ({ page }) => {
    await page.getByRole("button", { name: "No", exact: true }).click();
    await expect(page.getByText("EID Number (optional)")).toBeVisible({ timeout: 3000 });
  });

  test("Skip → /post", async ({ page }) => {
    await page.getByRole("button", { name: "Skip for now" }).click();
    await page.waitForURL(/\/post/, { timeout: 5000 });
  });
});

test.describe("Onboarding page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/onboarding");
    await page.waitForLoadState("networkidle");
  });

  test("shows GST/EID section", async ({ page }) => {
    await expect(page.getByText(/GSTIN|GST|registration/).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Seller type page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/seller-type");
    await page.waitForLoadState("networkidle");
  });

  test("6 options in grid", async ({ page }) => {
    await expect(page.locator(".grid.grid-cols-2 button")).toHaveCount(6);
  });

  test("select → Continue → /details", async ({ page }) => {
    await page.getByRole("button", { name: /Individual artisan/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/details/);
  });
});

test.describe("Details page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/details");
    await page.waitForLoadState("networkidle");
  });

  test("fields + +91 prefix", async ({ page }) => {
    await expect(page.getByPlaceholder("Neha Kumar")).toBeVisible();
    await expect(page.getByText("+91")).toBeVisible();
  });

  test("state dropdown → Continue → /post", async ({ page }) => {
    await page.locator("select").first().selectOption("Rajasthan");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL(/\/post/, { timeout: 5000 });
  });
});

test.describe("Verify page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/verify");
    await page.waitForLoadState("networkidle");
  });

  test("6 OTP fields + auto-focus + timer", async ({ page }) => {
    await expect(page.locator('input[maxlength="1"]')).toHaveCount(6);
    await page.locator('input[maxlength="1"]').first().fill("1");
    await expect(page.locator('input[maxlength="1"]').nth(1)).toBeFocused();
    await expect(page.getByText("Resend in")).toBeVisible();
  });

  test("fill OTP → /seller-type", async ({ page }) => {
    const inputs = page.locator('input[maxlength="1"]');
    for (let i = 0; i < 6; i++) await inputs.nth(i).fill(String(i + 1));
    await page.getByRole("button", { name: "Verify and continue" }).click();
    await expect(page).toHaveURL(/\/seller-type/);
  });
});

test.describe("No console errors", () => {
  const routes = ["/","/login","/signup","/post","/products","/orders","/earnings","/grow","/help","/profile","/add-product","/onboarding","/gst","/verify","/seller-type","/details"];
  for (const route of routes) {
    test(`${route}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(errors.filter(e => !e.includes("favicon") && !e.includes("403"))).toHaveLength(0);
    });
  }
});
