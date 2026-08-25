---
layout: home
title: ZeroToSaaS Accessibility Theme Suite
---

# ZeroToSaaS Accessibility Theme Suite

An enterprise-grade suite of **20 medically optimized, mathematically verified accessible Themes** (10 light + 10 night) for Google Antigravity IDE, Windsurf / Cascade, Visual Studio Code, Cursor, VSCodium, and OpenVSX.

Featuring an active **Semantic Cognitive Status System** (`Safe 🟢` → `Caution 🟡` → `Warning 🟠` → `Panic 🔴`), a built-in **Accessible Error Lens**, **Debounced High-Performance Decoration Engine**, **Universal Alternating Indent Shading**, and **Contextual File Adaptation** across 19+ programming languages.

> **This page is styled with ZeroToSaaS design tokens.** Use the theme switcher bar above to preview all 20 variants — every color on this page (headings, links, tables, code blocks, borders) updates instantly.

---

## Documentation Index

| Document                                                                                                      | Description                                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Themes Reference](docs/guides/Themes-Reference.html)                                                         | All 20 theme variants (10 light + 10 night) with canvas colors, chromatic identities, CVD mappings, and day/night auto-switch setup.                                                              |
| [Developer Health & Ergonomics](docs/guides/Health-and-Ergonomics.html)                                       | Ophthalmological rationale for light-mode-first design, pupil constriction optics, astigmatism halation elimination, age-graded ergonomics, CVD inclusivity, and the 20-20-20 clinical checklist. |
| [Security & Human Firewall](docs/guides/Security-and-Human-Firewall.html)                                     | Semantic Cognitive Status System, secret detection regexes (AWS, GitHub, Slack, JWT, private keys, DB URIs), code-smell prevention, and granular scanner toggles.                                 |
| [IDE Features & Tooling](docs/guides/IDE-Features.html)                                                       | Built-in Error Lens with Git blame, debounced decoration engine, indent shading, log file audit trails, recommended typography, supported IDEs, and installation instructions.                    |
| [Cross-Platform: Tokens & Terminals](docs/guides/Cross-Platform.html)                                         | Design token exports (CSS, Tailwind v3/v4, Figma/Style Dictionary) and terminal color schemes (iTerm2, Terminal.app, Windows Terminal, Alacritty, Kitty, Ghostty, Warp) for all 20 themes.        |
| [Validation Report](docs/guides/Validation.html)                                                              | Empirical quad-system validation report with figures (OkLCH, Paul Tol CVD, ColorBrewer, FM 100-Hue, WCAG AAA, APCA).                                                                              |
| [Medical Guidelines](docs/guides/Guidelines.html)                                                             | Clinical ophthalmology citations and ergonomic guidelines underpinning the theme design.                                                                                                          |
| [Wellness & Focus Report](docs/plans/wellness-and-focus-report.html)                                          | Full design and phased implementation plan for the wellness layer (Guardian, Eye-Break v2, Blink Coach, FocusFlow/Pomodoro).                                                                      |
| [Status Bar Widget Spec](docs/plans/status-bar-widget.html)                                                   | Requirement spec for the persistent `$(shield) ZeroToSaaS [AAA]` status bar badge with quick-access menu.                                                                                         |
| [Settings UI Grouping Spec](docs/plans/settings-ui-grouping.html)                                             | Requirement spec for scoped settings groups and ordering in the Preferences UI.                                                                                                                   |
| [APCA Gap Remediation Spec](docs/plans/apca-gap-remediation.html)                                             | Requirement spec for closing 400 APCA L^c contrast gaps across the 20 themes.                                                                                                                     |
| [Native-Setting Audit](docs/plans/native-setting-audit.html)                                                  | Audit of `zerotosaas.*` settings for duplication of native VS Code/VSCodium capabilities.                                                                                                         |
| [Distribution Plan](docs/plans/distribution.html)                                                             | npm package for design tokens + terminal bundles for all 7 terminals.                                                                                                                             |
| [License & Contributing](docs/legal/License-and-Contributing.html)                                            | AGPLv3 license terms, AGPL header templates for 6 language families, and Contributor License Agreements (ICLA/CCLA).                                                                              |
| [APCA Gap Catalogue](docs/data/apca-gaps.json)                                                                | Machine-readable catalogue of 400 APCA (WCAG 3.0 draft) L^c contrast gaps across the 20 themes, for future palette audit.                                                                         |
| [Interactive Gallery](https://zerotosaas-in.github.io/zerotosaas-accessibility-theme-suite/docs/gallery.html) | Live in-browser theme showcase and playground with code samples.                                                                                                                                  |

---

## Executive Manifesto

Software engineering is one of the most visually and cognitively demanding professions in the modern knowledge economy. For decades, the developer tooling ecosystem has relied on uncalibrated, high-glare, or unscientific dark themes that aggravate astigmatism, induce ciliary eye strain, and fail accessibility mandates.

**ZeroToSaaS bridges three critical engineering pillars**:

1. **Human Health & Ocular Physiology** — Protecting developers from Computer Vision Syndrome (CVS), astigmatic halation blur, and premature ocular fatigue through scientifically calibrated positive polarity. → [Full rationale](docs/guides/Health-and-Ergonomics.html)
2. **Universal Accessibility & Inclusion** — Colorblindness-calibrated palettes (Deuteranopia, Protanopia, Tritanopia) and ISO 9241-303 high-contrast options with 100% WCAG AAA contrast compliance. → [Theme variants](docs/guides/Themes-Reference.html)
3. **Digital Security & Privacy Compliance** — Turning syntax highlighting into an active **Human Firewall** that visually flags exposed secrets, UUIDs, cryptographic hashes, and hardcoded strings before they enter version control. → [Full details](docs/guides/Security-and-Human-Firewall.html)

### Quad-System Compatibility

| System                 | Standard                 | Implementation                                                                 |
| :--------------------- | :----------------------- | :----------------------------------------------------------------------------- |
| **OkLCH Color Space**  | Modern Web / Design      | Perceptual lightness invariant, zero glare (C ≤ 0.010)                         |
| **Paul Tol CVD-Safe**  | SRON / Medical Research  | Photoreceptor wavelength isolation across Deuteranopia, Protanopia, Tritanopia |
| **ColorBrewer Scales** | Information Architecture | Qualitative, Sequential, Diverging scale classification                        |
| **FM 100-Hue System**  | Clinical Ophthalmology   | 4-Quadrant optometric separation for alert/type/structure/function tokens      |

Plus **APCA 0.0.98G** (WCAG 3.0 draft) L^c perceptual contrast scoring with soft-gate gap tracking.

---

## Validation

Every theme release is mathematically asserted via our automated multi-tier validation engine:

```bash
pnpm run validate
```

This checks WCAG AAA (≥ 7:1) — the hard gate — plus APCA L^c (WCAG 3.0 draft, soft gate), OkLCH uniformity, Paul Tol ΔE, ColorBrewer scales, FM 100-Hue quadrants, and polarity sanity across all 20 themes.

---

## Development & Build

```bash
git clone https://github.com/zerotosaas-in/zerotosaas-accessibility-theme-suite.git
cd zerotosaas-accessibility-theme-suite
pnpm install

# Generate all 20 themes + IDE configs + gallery + tokens + terminals
pnpm run build

# Regenerate only design tokens + terminal schemes
pnpm run tokens

# Run WCAG AAA + APCA contrast validation
pnpm run validate

# Package into VSIX
pnpm run package
```

---

## License

AGPLv3 — [GNU Affero General Public License v3.0](LICENSE). See [License & Contributing](docs/legal/License-and-Contributing.html) for full terms, AGPL header templates, and CLA instructions.
