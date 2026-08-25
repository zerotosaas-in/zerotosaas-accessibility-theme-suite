---
layout: default
title: Release Plan — Style Dictionary / Figma Tokens Package
---

# Style Dictionary / Figma Tokens Package — Release Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Cross-Platform / CSS Frameworks |
| **Effort** | Low |
| **Status** | Not started |

---

## Current State

`tokens/zerotosaas.json` contains a nested `{ color: { canvas: { value, type } } }` structure top-level keyed by theme label. All 20 themes are represented as token sets. Compatible with Style Dictionary (as a `source` file) and Figma Tokens Studio (via Import).

## Distribution Goals

1. **npm package** — `@zerotosaas/design-tokens` with the JSON file and a Style Dictionary config template
2. **Figma Tokens Studio registry** — publish as a community token set
3. **GitHub release asset** — attach `zerotosaas.json` to each release
4. **CDN distribution** — available via jsDelivr/unpkg for programmatic access
5. **Documentation** — usage guide for both Style Dictionary and Figma Tokens Studio

## Tasks

- [ ] Create `package.json` for `@zerotosaas/design-tokens` with `main` pointing to `zerotosaas.json`
- [ ] Include a sample `style-dictionary.config.json` template in the package
- [ ] Include a Figma Tokens Studio import guide
- [ ] Publish to npm
- [ ] Add install instructions to Cross-Platform guide
- [ ] Verify Style Dictionary can consume `@zerotosaas/design-tokens/zerotosaas.json` as a source
- [ ] Verify Figma Tokens Studio import works with the JSON file

## Dependencies

- Style Dictionary 3.x+ (optional, for consumers)
- Figma Tokens Studio plugin (optional, for designers)
- `pnpm run tokens` to regenerate
- npm publishing access
