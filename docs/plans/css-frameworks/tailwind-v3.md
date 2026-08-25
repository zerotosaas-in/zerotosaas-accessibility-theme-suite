---
layout: default
title: Release Plan — Tailwind CSS v3 Preset Package
---

# Tailwind CSS v3 Preset Package — Release Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Cross-Platform / CSS Frameworks |
| **Effort** | Low |
| **Status** | Not started |

---

## Current State

`tokens/tailwind.preset.js` is a Tailwind CSS v3 preset that exports `colors.z2s.*` palette and a `darkMode` selector hook. Night variants activate when a parent element matches `[data-z2s-theme*="night"]`. Users consume it via `presets: [require("./tokens/tailwind.preset.js")]` in their `tailwind.config.js`.

## Distribution Goals

1. **npm package** — `@zerotosaas/tailwind-v3` with the preset, TypeScript types, and usage docs
2. **CDN distribution** — available via jsDelivr/unpkg
3. **GitHub release asset** — attach `tailwind.preset.js` to each release
4. **Documentation** — usage guide with example `tailwind.config.js`

## Tasks

- [ ] Create `package.json` for `@zerotosaas/tailwind-v3` with `main` and `exports` fields
- [ ] Add TypeScript type definitions for the preset shape
- [ ] Add usage README inside the package
- [ ] Publish to npm
- [ ] Add install instructions (`npm install @zerotosaas/tailwind-v3`) to Cross-Platform guide
- [ ] Verify `presets: [require("@zerotosaas/tailwind-v3")]` works end-to-end

## Dependencies

- Tailwind CSS v3.x
- `pnpm run tokens` to regenerate
- npm publishing access
