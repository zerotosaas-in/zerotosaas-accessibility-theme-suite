# Changelog

All notable changes to the **ZeroToSaaS Accessibility Theme Suite** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-08-23

### Changed — Command Palette Surface Reduction (9 → 3 commands)

- **Removed 6 redundant command-palette commands** that duplicated native IDE capabilities, per the §7 "Preferences-First, No Reinvented Wheels" principle:
  - `zerotosaas.selectTheme` / `zerotosaas.switchTheme` (QuickPick theme switcher) — replaced by VS Code/VSCodium's native `Ctrl+K Ctrl+T` (`workbench.action.selectTheme`), which lists all 20 ZeroToSaaS themes with live preview.
  - `zerotosaas.toggleErrorLens`, `zerotosaas.toggleStatusBadges`, `zerotosaas.toggleIndentShading`, `zerotosaas.toggleRestReminder` — boolean toggles that flip a setting already editable in the Settings UI (`Ctrl+,` → Extensions → ZeroToSaaS). The existing `onDidChangeConfiguration` listener re-initializes features when settings change.
- **Kept 3 action commands**: `zerotosaas.resetRestTimer` (resets the 20-20-20 countdown), `zerotosaas.openSettings` (opens Settings pre-filtered to ZeroToSaaS), `zerotosaas.openGuidelines` (opens `docs/Guidelines.md` in Markdown preview).
- **Dark-theme eye-health advisory** now fires for all dark-theme activations (via native `Ctrl+K Ctrl+T` or any other mechanism), with the existing per-day dedupe and persistent suppression. The "Switch to Light Theme" button now invokes the native theme picker.
- **Zero feature loss**: all 16 config settings, all decoration engines, all scanners, the rest assistant, and the dark-theme advisory are preserved.

### Removed

- `handleThemeSelection()` function and `themeChangeByExtension` flag from `src/extension.js` (~100 lines of dead code after the QuickPick removal).

## [0.2.0] - 2026-08-23

### Added — Night (Dark) Theme Suite & Day/Night Auto-Switcher

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
  - Command: `ZeroToSaaS: Toggle Day / Night Auto-Switch`.
  - Polls every 5 minutes; applies the target theme only on hour-boundary transitions.

- **Shared Color-Science Module** (`scripts/color-math.js`):
  - Extracted OkLCH / WCAG / CVD math into a single DRY module consumed by both `generate-themes.js` and `validate-contrast.js`.
  - Added `invertLightness()` and `deriveDarkCanvasStack()` helpers for programmatic dark palette derivation.

- **Polarity Sanity Validation** — `scripts/validate-contrast.js` now asserts that foreground luminance is correctly oriented relative to background luminance per theme type (light vs dark), catching palette inversion bugs.

- **QuickPick Theme Grouping** — `ZeroToSaaS: Select Theme / Palette` now groups themes by `Light Themes` and `Night Themes` separators.

- **Dark Theme Eye Health Warning** — selecting any Night (dark) theme now triggers a modal warning citing the medical rationale against prolonged dark-theme use:
  - Pupil dilation and increased ocular accommodation effort (Computer Vision Syndrome).
  - Environmental myopia hypothesis (Morgan et al., 2022) — reduced luminance contrast may worsen myopia progression.
  - Halation and spherical aberration for users with astigmatism.
  - Ciliary muscle fatigue comparison between ambient-bright and dark environments.
  - Offers "Apply Anyway" or "Pick a Light Theme Instead" actions.
  - Also fires for dark themes activated via VS Code's native theme picker (Ctrl+K Ctrl+T), with a "Switch to Light Theme" action. Extension-initiated changes (auto-switcher) are suppressed to avoid redundant warnings.

### Changed

- **Theme count**: 10 → 20 (10 Light + 10 Night).
- **Validation scope**: 420 → 860 token contrast tests, all passing 100% WCAG AAA (≥ 7:1).
- **Gallery**: `docs/previews/gallery.html` now includes all 20 themes with Night variants and the missing Tritanopia light theme.
- **Terminal ANSI semantics**: `terminal.ansiBlack`/`ansiWhite`/`ansiBrightBlack`/`ansiBrightWhite` now correctly invert meaning on dark themes.
- **Shadows**: `widget.shadow`, `inlineChat.shadow`, and `editorStickyScroll.shadow` use stronger alpha on dark canvases for correct depth perception.

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
  - Complete styling for AI Chat panels, prompt bubbles, slash commands (`/goal`, `/schedule`, `/grill-me`, `/learn`), inline diffs, and Supercomplete ghost text previews.

- **Contextual File-Type Adaptation**:
  - 19+ programming languages, configurations (ENV, JSON, YAML, TOML), and un-tinted prose modes for Markdown and documentation.

- **Automated Mathematical Contrast Verification**:
  - `scripts/validate-contrast.js` asserting 100% WCAG AAA ($\ge 7:1$) relative luminance across all 420 token combinations.

- **Licensing & Copyright**:
  - Officially licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
  - Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in).
