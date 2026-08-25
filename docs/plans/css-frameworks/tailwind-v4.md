---
layout: default
title: Release Plan — Tailwind CSS v4 Theme Package
---

# Tailwind CSS v4 Theme Package — Release Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Cross-Platform / CSS Frameworks |
| **Effort** | Low |
| **Status** | Not started |

---

## Current State

`tokens/tailwind.v4.css` uses Tailwind CSS v4's native `@theme` block to register `--color-z2s-*` custom properties, auto-generating `bg-z2s-*`, `text-z2s-*`, `border-z2s-*` utilities. Per-variant overrides use the same `[data-z2s-theme="<slug>"]` selector pattern. Users consume it via `@import "tailwindcss"; @import "./tokens/tailwind.v4.css";`.

## Distribution Goals

1. **npm package** — `@zerotosaas/tailwind-v4` with the CSS file and usage docs
2. **CDN distribution** — available via jsDelivr/unpkg
3. **GitHub release asset** — attach `tailwind.v4.css` to each release
4. **Documentation** — usage guide with example `app.css`

## Tasks

- [ ] Create `package.json` for `@zerotosaas/tailwind-v4` with `exports` mapping for CSS
- [ ] Add usage README inside the package
- [ ] Publish to npm
- [ ] Add install instructions (`npm install @zerotosaas/tailwind-v4`) to Cross-Platform guide
- [ ] Verify `@import "@zerotosaas/tailwind-v4/tailwind.v4.css"` works with Tailwind v4 build pipeline

## Dependencies

- Tailwind CSS v4.x (CSS-first config)
- `pnpm run tokens` to regenerate
- npm publishing access
