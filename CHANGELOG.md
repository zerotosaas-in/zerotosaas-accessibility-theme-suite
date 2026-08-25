# Changelog

All notable changes to the **ZeroToSaaS Accessibility Theme Suite** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-08-25

### Added — Design Token & Terminal Exports

- **Design token exporter** (`scripts/export-tokens.js`): generates CSS custom properties, Tailwind v3 preset, Tailwind v4 theme, and Style Dictionary JSON for all 20 themes (4 files in `tokens/`).
- **Terminal color scheme exporter**: generates 140 terminal profiles across 7 targets (iTerm2, macOS Terminal.app, Windows Terminal, Alacritty, Kitty, Ghostty, Warp) × 20 themes.
- **macOS Terminal.app support**: `.terminal` files with correct NSKeyedArchiver format (`NSColorSpace = 2`, null-terminated NSRGB, `type = "Window Settings"`, `ProfileCurrentVersion = 2.09`).
- **APCA 0.0.98G contrast validation** (`scripts/color-math.js`, `scripts/validate-contrast.js`): perceptual L^c scoring as a soft gate alongside the existing WCAG AAA hard gate. Gap report written to `docs/apca-gaps.json`.
- **Extension icon** (`media/icon.png`): 256×256 accessibility icon for marketplace listings.
- **Themed GitHub Pages home page** (`_layouts/home.html`, `index.md`): custom Jekyll layout styled with ZeroToSaaS design tokens and an interactive switcher bar for all 20 theme variants.

### Changed — Documentation Restructure

- **README split**: 716-line README reduced to a lean hub with links to 6 focused documents under `docs/` (Themes-Reference, Health-and-Ergonomics, Security-and-Human-Firewall, IDE-Features, Cross-Platform, License-and-Contributing).
- **All README links converted to absolute URLs**: badges, documentation index table, and body links now point to `https://github.com/zerotosaas-in/zerotosaas-accessibility-theme-suite/blob/main/...` so they work on GitHub, open-vsx, and any other rendering context.
- **Gallery links** now use the absolute GitHub Pages URL.
- **`package.json` metadata fixed**: `repository`, `homepage`, and `bugs` URLs corrected to `zerotosaas-in/zerotosaas-accessibility-theme-suite`.

### Fixed

- **README badge line truncation**: a tooling artifact (`[truncated 304 chars]`) embedded in the badges HTML caused GitHub Pages to render raw HTML code instead of the rendered page.
- **`.vscodeignore` updated**: excludes Jekyll artifacts (`_layouts/`, `index.md`, `.jekyll-cache/`, `media/*.svg`) from the VSIX.
- **Stale VSIX removed**: `zerotosaas-theme-0.3.0.vsix` build artifact removed from git tracking.

## [0.4.0] - 2026-08-25

### Added — GitHub Pages Home Page

- **Custom Jekyll layout** (`_layouts/home.html`, `index.md`): initial themed landing page for the GitHub Pages site, replacing the default cayman theme for the root page.

### Changed

- **README updated**: theme count corrected from 10 to 20 variants; security badge added.
- **Documentation split**: README content reorganized into 6 focused documents under `docs/` (Themes-Reference, Health-and-Ergonomics, Security-and-Human-Firewall, IDE-Features, Cross-Platform, License-and-Contributing) with `docs/index.md` as the documentation portal.

### Fixed

- **Stale VSIX removed**: `zerotosaas-theme-0.3.0.vsix` binary removed from the repository.

## [0.3.0] - 2026-08-25

### Added — Design Tokens & Terminal Color Schemes

- **Pre-generated design tokens** (`tokens/`): CSS custom properties (`zerotosaas.css`), Tailwind v3 preset (`tailwind.preset.js`), Tailwind v4 theme (`tailwind.v4.css`), and Style Dictionary JSON (`zerotosaas.json`) for all 20 themes.
- **Terminal color schemes** (`terminals/`): 140 profiles across 7 targets (iTerm2, macOS Terminal.app, Windows Terminal, Alacritty, Kitty, Ghostty, Warp) × 20 themes.
- **Token export script** (`scripts/export-tokens.js`): generates all token and terminal outputs from the theme JSON sources.

### Changed

- **README updated**: added usage instructions for generated token and terminal outputs.
- **`docs/TODO.md` cleaned**: now contains only unfinished work, with correct link to `docs/plans/wellness-and-focus-report.md`.

## [0.2.0] - 2026-08-24

### Added — Night Theme Suite, Auto-Switcher & Status Badge Detection

- **10 Night (Dark) Theme Variants** — polarity-inverted counterparts of every light theme, preserving hue and chroma for CVD-safe wavelength discrimination:
  - `ZeroToSaaS Light Night (Default)`: Dark cobalt-slate canvas, glare-free night coding.
  - `ZeroToSaaS High Contrast Night (ISO 9241-303)`: Pure black canvas with white borders, 21:1 contrast.
  - `ZeroToSaaS Deuteranopia Night (Blue / Orange)`: Dark Blue/Amber CVD-safe palette.
  - `ZeroToSaaS Protanopia Night (Magenta / Teal)`: Dark Magenta/Teal CVD-safe palette.
  - `ZeroToSaaS Tritanopia Night (Crimson / Cyan)`: Dark Crimson/Cyan CVD-safe palette.
  - `ZeroToSaaS Warm Sepia Night (Brown)`: Dark espresso & walnut tones.
  - `ZeroToSaaS Forest Calm Night (Green)`: Dark cypress & cedar tones.
  - `ZeroToSaaS Royal Plum Night (Purple)`: Dark iris & midnight-plum tones.
  - `ZeroToSaaS Golden Sand Night (Yellow)`: Dark amber bronze & sandstone.
  - `ZeroToSaaS Terracotta Night (Orange)`: Dark burnt orange & rich bronze.

- **Day / Night Auto-Switcher** — circadian theme scheduling based on local time:
  - Configuration: `zerotosaas.autoSwitch.enabled`, `zerotosaas.autoSwitch.dayTheme`, `zerotosaas.autoSwitch.nightTheme`, `zerotosaas.autoSwitch.dayStartHour`, `zerotosaas.autoSwitch.nightStartHour`.
  - Polls every 5 minutes; applies the target theme only on hour-boundary transitions.

- **Status badge detection** (`zerotosaas.statusBadgeDetection`): configurable detection of cognitive status badges in code.

- **File size gate**: optimized decoration processing to skip excessively large files.

- **Shared Color-Science Module** (`scripts/color-math.js`):
  - Extracted OkLCH / WCAG / CVD math into a single DRY module consumed by both `generate-themes.js` and `validate-contrast.js`.
  - Added `invertLightness()` and `deriveDarkCanvasStack()` helpers for programmatic dark palette derivation.

- **Polarity Sanity Validation** — `scripts/validate-contrast.js` now asserts that foreground luminance is correctly oriented relative to background luminance per theme type (light vs dark).

- **Wellness & Focus Report** (`docs/plans/wellness-and-focus-report.md`): full design and phased implementation plan for the wellness layer.

- **Dark Theme Eye Health Warning** — selecting any Night (dark) theme triggers a modal warning citing the medical rationale against prolonged dark-theme use, with per-day dedupe and persistent suppression.

### Changed — Command Palette Surface Reduction (9 → 3 commands)

- **Removed 6 redundant command-palette commands** that duplicated native IDE capabilities:
  - `zerotosaas.selectTheme` / `zerotosaas.switchTheme` (QuickPick theme switcher) — replaced by VS Code/VSCodium's native `Ctrl+K Ctrl+T`.
  - `zerotosaas.toggleErrorLens`, `zerotosaas.toggleStatusBadges`, `zerotosaas.toggleIndentShading`, `zerotosaas.toggleRestReminder` — boolean toggles already editable in Settings UI.
- **Kept 3 action commands**: `zerotosaas.resetRestTimer`, `zerotosaas.openSettings`, `zerotosaas.openGuidelines`.
- **Theme count**: 10 → 20 (10 Light + 10 Night).
- **Validation scope**: 420 → 860 token contrast tests, all passing 100% WCAG AAA (≥ 7:1).
- **Gallery**: `docs/previews/gallery.html` updated with all 20 themes, night variants, and mobile-responsive CSS.
- **Terminal ANSI semantics**: `terminal.ansiBlack`/`ansiWhite`/`ansiBrightBlack`/`ansiBrightWhite` now correctly invert meaning on dark themes.

### Removed

- `handleThemeSelection()` function and `themeChangeByExtension` flag from `src/extension.js` (~100 lines of dead code after the QuickPick removal).

## [0.1.1] - 2026-08-23

### Added

- **IDE config updater** (`scripts/update-ide-configs.js`): script to handle IDE extension configurations across supported editors.

### Changed

- **Build pipeline**: `pnpm run build` now includes `update-ide-configs.js`.
- **High Contrast theme**: corrected `type` to `"light"` in `themes/zerotosaas-high-contrast.json`.

### Removed

- `zerotosaas-theme-0.1.0.vsix` build artifact removed from the repository.

## [0.1.0] - 2026-08-22

### Initial Release

- **10 Medically Optimized Accessible Theme Variants**:
  - `ZeroToSaaS Light (Default)`: Medically recommended contrast base for long reading sessions and general software development.
  - `ZeroToSaaS High Contrast`: ISO 9241-303 compliant high luminance ($>15:1$) & solid structural borders.
  - `ZeroToSaaS Deuteranopia`: Red-Green (green-weakness) CVD palette with Blue/Orange focus.
  - `ZeroToSaaS Protanopia`: Red-Green (red-weakness) CVD palette with high-luminance Magenta/Teal/Blue focus.
  - `ZeroToSaaS Tritanopia`: Blue-Yellow CVD palette with Crimson/Cyan/Slate focus.
  - `ZeroToSaaS Warm Sepia (Brown)`: Soothing warm parchment, espresso borders, and walnut text.
  - `ZeroToSaaS Forest Calm (Green)`: Restorative sage canvas, deep cypress, and cedar tones.
  - `ZeroToSaaS Royal Plum (Purple)`: Delicate lavender mist canvas, deep iris, and midnight-plum text.
  - `ZeroToSaaS Golden Sand (Yellow)`: Warm sandstone canvas, solar ochre, and amber bronze.
  - `ZeroToSaaS Terracotta (Orange)`: Warm spiced linen canvas, burnt orange, and rich bronze.

- **Semantic Cognitive Status System (Active Human Firewall)**:
  - `Safe 🟢`: Verified types, interfaces, schemas, and structs with subtle mint background badges.
  - `Caution 🟡`: Function parameters, dynamic arguments, and config keys with subtle yellow background badges.
  - `Warning 🟠`: Hardcoded strings and magic literals in source code with subtle orange background badges.
  - `Panic 🔴`: Secret keys (AWS, GitHub, Stripe, GCP), JWTs, DB connection URIs, UUIDs, hex color codes, and regex expressions with high-visibility red badges.

- **Built-in Accessible Error Lens & Instant Git Blame**:
  - Non-bold italicized inline diagnostic reporting at `0.9em` font size.
  - Inline Git authorship history (`Alex Jenkins, 2d ago [a8f9c1]`) injected directly on broken or warned lines.
  - Fully configurable via user settings (`zerotosaas.errorLens.*`).

- **Universal Alternating Indent Column Shading**:
  - Alternating optical column bands for both space and hard-tab indented source code.

- **Full AI-First IDE Compatibility**:
  - Native UI token support for **Google Antigravity IDE**, **Windsurf / Cascade**, **Cursor**, **VS Code**, and **VSCodium**.
  - Complete styling for AI Chat panels, prompt bubbles, slash commands, inline diffs, and Supercomplete ghost text previews.

- **Contextual File-Type Adaptation**:
  - 19+ programming languages, configurations (ENV, JSON, YAML, TOML), and un-tinted prose modes for Markdown and documentation.

- **Automated Mathematical Contrast Verification**:
  - `scripts/validate-contrast.js` asserting 100% WCAG AAA ($\ge 7:1$) relative luminance across all 420 token combinations.

- **Licensing & Copyright**:
  - Officially licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
  - Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in).
