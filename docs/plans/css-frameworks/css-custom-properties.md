---
layout: default
title: Release Plan — CSS Custom Properties Token Package
---

# CSS Custom Properties Token Package — Release Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Cross-Platform / CSS Frameworks |
| **Effort** | Low |
| **Status** | Not started |

---

## Current State

`tokens/zerotosaas.css` contains CSS custom properties for all 20 theme variants. The `:root` block defines the default light theme; 19 per-variant override blocks use `[data-z2s-theme="<slug>"]` selectors. Tokens include `--z2s-canvas`, `--z2s-fg`, `--z2s-fg-muted`, `--z2s-accent`, `--z2s-safe-fg`, `--z2s-caution-fg`, `--z2s-warning-fg`, `--z2s-panic-fg`, and full syntax token variables.

## Distribution Goals

1. **CDN distribution** — publish on jsDelivr/unpkg so users can `<link>` directly
2. **npm package** — `@zerotosaas/css-tokens` with the CSS file and TypeScript type definitions for variant slugs
3. **GitHub release asset** — attach `zerotosaas.css` to each GitHub release
4. **Documentation** — usage guide in `docs/guides/Cross-Platform.md`

## Tasks

- [ ] Create `package.json` for `@zerotosaas/css-tokens` with `main` pointing to `zerotosaas.css`
- [ ] Add TypeScript type definitions for `data-z2s-theme` attribute values
- [ ] Publish to npm
- [ ] Set up CDN distribution (jsDelivr: `https://cdn.jsdelivr.net/npm/@zerotosaas/css-tokens/zerotosaas.css`)
- [ ] Add CDN link to README and Cross-Platform guide
- [ ] Verify `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@zerotosaas/css-tokens/zerotosaas.css">` works

## Dependencies

- `pnpm run tokens` to regenerate
- npm publishing access
