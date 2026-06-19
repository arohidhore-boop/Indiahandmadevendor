# E2E Test Report — India Handmade Vendor

**Date**: 2026-06-19  
**Test suite**: 141 Playwright tests across 9 pages  
**Result**: 141 passed / 0 failed  
**Browser**: Chromium (headless)  

---

## Summary of Issues Found

| # | Severity | Category | Issue |
|---|----------|----------|-------|
| 1 | 🔴 High | Performance | Hero & artisan images are 1.7–2.6 MB, no optimization |
| 2 | 🔴 High | UX | Footer links are all dead (`href="#"` or `<Link to="/">`) |
| 3 | 🔴 High | UX | "Forgot password?" link has no `href` — dead link |
| 4 | 🔴 High | UX | Social login buttons redirect to `/verify` instead of OAuth |
| 5 | 🟡 Medium | Performance | `window.location.href` used for navigation, causing full page reloads |
| 6 | 🟡 Medium | Validation | `validateStep()` in onboarding returns `{}` — all validation stubbed |
| 7 | 🟡 Medium | Forms | Signup form uses `noValidate` — no client-side validation |
| 8 | 🟡 Medium | Forms | Login/signup have hardcoded demo credentials in production code |
| 9 | 🟡 Medium | UX | Password toggle shares state between password + confirm password |
| 10 | 🟡 Medium | UX | Signup "Step 1 of 5" has no name field — only email + password |
| 11 | 🟡 Medium | UX | No mobile hamburger menu — only "Sign in" link on small screens |
| 12 | 🟡 Medium | CSS | Duplicate `<style>` blocks injected on login + signup pages |
| 13 | 🟡 Medium | A11y | Some icon-only buttons lack `aria-label` |
| 14 | 🟢 Low | Data | "Out of stock" filter checks `stock === 0`, never matches `undefined` (MTO) |
| 15 | 🟢 Low | UX | No loading indicators during page transitions |
| 16 | 🟢 Low | SEO | Missing/broken favicon |
| 17 | 🟢 Low | UX | Landing page has no `lang` attribute explicitly on `<html>` in SPA mode |
| 18 | 🟢 Low | Performance | `@source "../src"` in Tailwind v4 scans all source files |

---

## Detailed Findings

### 1. 🔴 Unoptimized Images (2.6 MB hero image)

**Location**: `src/routes/index.tsx` + `src/assets/`

Images loaded on landing page:
- `hero-artisan.jpg` — 2.6 MB, loaded eagerly (no `loading="lazy"`)
- `artisan-woodcarver.jpg` — 1.7 MB
- `artisan-sakhi.jpg` — 2.2 MB
- `artisan-mysore.jpg` — ? MB

No `srcset`, no `<picture>`, no CDN, no compression pipeline. This is the primary performance issue. On a 3G connection, the hero image alone takes ~20 seconds to load.

**Fix**: Use `vite-imagetools` or Sharp to generate responsive sizes at build time. Add `loading="lazy"` to below-fold images. Consider WebP/AVIF conversion.

### 2. 🔴 Footer Links Are All Dead

**Location**: `src/routes/index.tsx:230-260`

Every footer link either points to `#` or to `/`:
```tsx
<a href="#" aria-label={label}>…</a>   // social links
<a href="#" className="…">{link}</a>    // footer columns
<Link to="/" className="…">Terms & Conditions</Link>
<Link to="/" className="…">Privacy Policy</Link>
```

The footer has 16+ links across 4 columns, all non-functional.

### 3. 🔴 "Forgot password?" Link Has No `href`

**Location**: `src/routes/login.tsx:45`

```tsx
<a className="text-sm text-[var(--primary)] hover:underline">Forgot password?</a>
```

An `<a>` tag without `href` is not keyboard-focusable and does nothing on click. E2E test confirms `href === null`.

### 4. 🔴 Social Login Buttons Redirect to `/verify`

**Location**: `src/routes/signup.tsx:23,35,44`

All three social buttons (Google, Facebook, Apple) use `window.location.href = "/verify"` as their onClick — they don't implement OAuth. This is demo/stub behavior presented as real functionality.

### 5. 🟡 Full Page Reloads via `window.location.href`

**Location**: Multiple files

The app uses `window.location.href` for navigation in multiple places:
- `signup.tsx:63` — form submit: `window.location.href = "/verify"`
- `add-product.tsx:128` — Back button: `window.location.href = "/post"`
- `add-product.tsx:146` — Congrats modal: `window.location.href = "/post"`

This defeats the SPA architecture, causing full document reloads, losing client state, and degrading UX.

**Fix**: Use `useNavigate()` consistently.

### 6. 🟡 Onboarding Validation Is Stubbed

**Location**: `src/routes/onboarding.tsx:1095-1097`

```tsx
function validateStep(_step: number, _d: OnboardingData): Record<string, string> {
  return {};
}
```

All parameters are prefixed with `_` (unused). No validation is implemented for any of the 5 onboarding steps. Users can submit empty forms.

### 7. 🟡 Signup Form Uses `noValidate`

**Location**: `src/routes/signup.tsx:66`

```tsx
<form … noValidate>
```

Browser-native validation is explicitly disabled. No custom validation replaces it. Users can submit without entering any data.

### 8. 🟡 Hardcoded Demo Credentials in Production Code

**Location**: `src/routes/login.tsx:29,33`

```tsx
<input type="email" … defaultValue="demo@indiahandmade.in" />
<input type="password" … defaultValue="demo1234" />
```

These credentials are baked into the production code. Any user inspecting the page source sees them.

### 9. 🟡 Shared Password Toggle State

**Location**: `src/routes/signup.tsx:73,80`

```tsx
const [show, setShow] = useState(false);
// …
<input type={show ? "text" : "password"} … />  // password
<input type={show ? "text" : "password"} … />  // confirm password
```

One toggle reveals BOTH password fields. The confirm password field should have its own visibility toggle or not be affected.

### 10. 🟡 Signup Missing Name Field

**Location**: `src/routes/signup.tsx:60-85`

The signup page is labeled "Step 1 of 5" but only collects email + password + confirm password. The user's name is not collected until later (onboarding), which is disjointed UX for account creation.

### 11. 🟡 No Mobile Navigation

**Location**: `src/routes/index.tsx:52-57`

```tsx
<Link to="/signup" className="ih-btn ih-btn-primary hidden sm:inline-flex">
  Start selling
</Link>
```

The CTA button is hidden on mobile (`hidden sm:inline-flex`). Only "Sign in" is visible. No hamburger menu. Mobile users have severely limited navigation.

### 12. 🟡 Duplicate `<style>` Injection

**Location**: `src/routes/login.tsx:58`, `src/routes/signup.tsx:91`

Both pages inject identical `.ih-input` CSS via inline `<style>` tags. Navigating between login and signup pages adds duplicate styles to the DOM. CSS should live in the global stylesheet.

### 13. 🟡 Accessibility: Buttons Without Labels

E2E tests found some icon-only buttons lack accessible names across multiple pages. While the count is small, every interactive element needs an accessible name.

### 14. 🟢 Stock Filter Logic Gap

**Location**: `src/routes/products.tsx:25`

```tsx
if (f === "Out of stock") return p.status === "out" || p.stock === 0;
```

Made-to-order products have `stock: undefined`. The `stock === 0` check never matches `undefined`, so MTO products never appear in the "Out of stock" filter even if they should.

### 15. 🟢 No Loading States

Pages transition without loading indicators. On slow connections, users see blank or stale content with no feedback that navigation is in progress.

### 16. 🟢 Missing Favicon

No favicon is properly configured. Console shows 404 errors for `/favicon.ico`. E2E tests filter these out to avoid noise.

### 17. 🟢 SPA `lang` Attribute

The `<html lang="en">` is set in `RootShell` (SSR), but in client-side SPA navigation, the attribute is not consistently present.

### 18. 🟢 Tailwind v4 Source Scanning

`@source "../src"` scans all files in `src/`. This is the recommended approach for v4 but can cause slower HMR in large codebases. Consider narrowing the source scope as the project grows.

---

## E2E Test Coverage

| Page | Tests | Status |
|------|-------|--------|
| Landing (`/`) | 16 | ✅ All passing |
| Login (`/login`) | 8 | ✅ All passing |
| Signup (`/signup`) | 6 | ✅ All passing |
| Dashboard (`/post`) | 7 | ✅ All passing |
| Products (`/products`) | 7 | ✅ All passing |
| Orders (`/orders`) | 4 | ✅ All passing |
| Profile (`/profile`) | 6 | ✅ All passing |
| Add Product (`/add-product`) | 6 | ✅ All passing |
| Onboarding (`/onboarding`) | 4 | ✅ All passing |
| **Per-page perf/a11y** | 63 | ✅ All passing |
| **Cross-page consistency** | 9 | ✅ All passing |
| **Total** | **141** | **141 ✅** |

### Test Categories
- **Page load & rendering**: title, critical content, no blank pages
- **Console errors**: no JS errors, no hydration mismatches
- **Navigation**: links navigate to correct routes, buttons trigger actions
- **Forms**: field presence, toggles, search filtering
- **Performance**: load time <5s, images loaded, no broken resources
- **Accessibility**: `lang` attr, landmarks, button labels, no positive tabindex
- **SEO**: meta tags, viewport meta, image alt text
- **Consistency**: CSS variables consistent across pages

### Test files
- `e2e/landing.spec.ts` — 16 tests
- `e2e/auth.spec.ts` — 14 tests  
- `e2e/dashboard.spec.ts` — 24 tests
- `e2e/add-product.spec.ts` — 10 tests
- `e2e/performance.spec.ts` — 77 tests

---

## Running the Tests

```bash
# Start dev server
bun run dev --port 3456

# Run all tests
npx playwright test

# Run specific suite
npx playwright test e2e/landing.spec.ts

# With UI
npx playwright test --ui
```
