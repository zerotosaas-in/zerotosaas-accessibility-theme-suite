---
layout: default
title: The 20 Accessible Theme Variants
---

# 🎨 The 20 Accessible Theme Variants (10 Light + 10 Night)

Every variant passes **100% WCAG AAA ($\ge 7:1$)** relative luminance tests across all 860 token combinations. Each light theme has a polarity-inverted Night counterpart that preserves hue and chroma for CVD-safe wavelength discrimination.

---

## Light Themes

| Theme Variant                         | Canvas Background | Chromatic Identity & Mood          | Target Audience / Medical Standard            |
| :------------------------------------ | :---------------- | :--------------------------------- | :-------------------------------------------- |
| **`ZeroToSaaS Light (Default)`**      | `#FCFCFD`         | Cobalt Slate & Rich Cedar          | Universal ergonomic coding; all developers    |
| **`ZeroToSaaS High Contrast`**        | `#FFFFFF`         | Stark Monochrome & Midnight Indigo | **ISO 9241-303**; reduced retinal illuminance |
| **`ZeroToSaaS Deuteranopia`**         | `#FAFCFE`         | Deep Oceanic Blue & Warm Amber     | Green-weakness / Deuteranopia CVD             |
| **`ZeroToSaaS Protanopia`**           | `#FCFAFC`         | Jewel Magenta & Arctic Teal        | Red-weakness / Protanopia CVD                 |
| **`ZeroToSaaS Tritanopia`**           | `#FAFCFC`         | Regal Crimson & Deep Cyan          | Blue-Yellow / Tritanopia CVD                  |
| **`ZeroToSaaS Warm Sepia (Brown)`**   | `#FCFAF6`         | Warm Parchment & Espresso          | Soft, low-contrast ambient room lighting      |
| **`ZeroToSaaS Forest Calm (Green)`**  | `#F8FCF9`         | Restorative Sage & Forest Cypress  | Calming, natural organic visual ambiance      |
| **`ZeroToSaaS Royal Plum (Purple)`**  | `#FAF8FD`         | Lavender Mist & Midnight Plum      | Focused, elegant, high-clarity development    |
| **`ZeroToSaaS Golden Sand (Yellow)`** | `#FCFAF4`         | Warm Sandstone & Solar Ochre       | Gentle warm daylight simulation               |
| **`ZeroToSaaS Terracotta (Orange)`**  | `#FCF8F4`         | Spiced Linen & Burnt Terracotta    | High-energy, warm crisp contrast              |

---

## Night (Dark) Themes

| Theme Variant                               | Canvas Background | Chromatic Identity & Mood             | Target Audience / Medical Standard        |
| :------------------------------------------ | :---------------- | :------------------------------------ | :---------------------------------------- |
| **`ZeroToSaaS Light Night (Default)`**      | `#0E1116`         | Dark Cobalt Slate & Glare-Free Canvas | Universal night coding; all developers    |
| **`ZeroToSaaS High Contrast Night`**        | `#000000`         | Pure Black & White Borders            | **ISO 9241-303**; 21:1 contrast on dark   |
| **`ZeroToSaaS Deuteranopia Night`**         | `#0E1419`         | Dark Oceanic Blue & Warm Amber        | Green-weakness / Deuteranopia CVD (night) |
| **`ZeroToSaaS Protanopia Night`**           | `#100E12`         | Dark Jewel Magenta & Arctic Teal      | Red-weakness / Protanopia CVD (night)     |
| **`ZeroToSaaS Tritanopia Night`**           | `#0E1214`         | Dark Regal Crimson & Deep Cyan        | Blue-Yellow / Tritanopia CVD (night)      |
| **`ZeroToSaaS Warm Sepia Night (Brown)`**   | `#0E0D0B`         | Dark Espresso & Walnut                | Soft, low-glare ambient night lighting    |
| **`ZeroToSaaS Forest Calm Night (Green)`**  | `#0B0E0C`         | Dark Cypress & Cedar                  | Calming, natural organic night ambiance   |
| **`ZeroToSaaS Royal Plum Night (Purple)`**  | `#0E0D10`         | Dark Iris & Midnight Plum             | Focused, elegant night development        |
| **`ZeroToSaaS Golden Sand Night (Yellow)`** | `#0E0D09`         | Dark Amber Bronze & Sandstone         | Gentle warm night simulation              |
| **`ZeroToSaaS Terracotta Night (Orange)`**  | `#0F0D0A`         | Dark Burnt Orange & Rich Bronze       | High-energy, warm crisp night contrast    |

---

## Day / Night Auto-Switch (Native VS Code / VSCodium)

ZeroToSaaS uses the IDE's built-in `window.autoDetectColorScheme` for OS-appearance-based theme switching — no custom timer, no polling, no conflicts with your manual choices. On first run, the extension sets `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` to ZeroToSaaS themes (only if you haven't configured them already).

To enable OS-appearance-following theme switching:

```json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "ZeroToSaaS Light (Default)",
  "workbench.preferredDarkColorTheme": "ZeroToSaaS Light Night (Default)"
}
```

When enabled, the IDE follows your OS appearance setting (macOS System Settings → Appearance, Windows Settings → Personalization → Colors, etc.) and switches between the preferred light and dark themes automatically. Your manual theme choice (via `Ctrl+K Ctrl+T`) is always respected — the OS-appearance switch only fires when the OS mode itself changes.

---

> 📖 **See also**: [Cross-Platform: Terminals, Design Tokens & Web Frameworks](Cross-Platform.md) for pre-generated terminal schemes and design tokens matching all 20 variants.
