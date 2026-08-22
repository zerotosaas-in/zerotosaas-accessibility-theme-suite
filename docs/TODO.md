---
layout: default
title: Engineering Roadmap & Future Milestones
---

# ZeroToSaaS Theme Suite — Roadmap & TODO

This document outlines prioritized recommendations and planned engineering enhancements for the **ZeroToSaaS Accessibility Theme Suite**.

---

## 📋 Prioritized Enhancement Matrix

| Priority | Category      | Feature / Enhancement                                | Impact                                                                                  | Effort |
| :------- | :------------ | :--------------------------------------------------- | :-------------------------------------------------------------------------------------- | :----- |
| **P0**   | Distribution  | **Open VSX Registry Publication**                    | Makes the theme suite installable from the Open VSX Registry.                           | Low    |
| **P1**   | Performance   | **Debounced Decoration Engine & Version Guards**     | Prevents UI thread stuttering on rapid typing and eliminates race conditions.           | Low    |
| **P1**   | Security      | **Extended "Human Firewall" Secret Scanners**        | Traps AWS keys, JWTs, GitHub/Slack tokens, and private key headers.                     | Low    |
| **P2**   | Ergonomics    | **20-20-20 Ocular Rest Assistant & Blink Reminder**  | Integrates clinical break reminders and blink rate calibration into the status bar.     | Medium |
| **P2**   | Configuration | **Granular Status Badge Scanner Toggles**            | Allows developers to selectively toggle secret, string, and type scanning.              | Low    |
| **P2**   | UX / Workflow | **Interactive QuickPick Theme Switcher**             | Dedicated command (`zerotosaas.switchTheme`) with CVD and ambient category previews.    | Low    |
| **P3**   | Validation    | **APCA (WCAG 3.0) & CVD Simulation Suite**           | Adds APCA $L^c$ scoring and programmatic Brettel/Machado colorblindness validation.     | Medium |
| **P3**   | Ecosystem     | **Design Token Exporter (CSS, Tailwind, Terminals)** | Generates CSS custom properties, Tailwind presets, and iTerm2/Alacritty/Kitty profiles. | Medium |
| **P3**   | Ergonomics    | **Ambient Light & Day/Night Theme Auto-Switching**   | Adapts theme brightness and hue based on time of day or system appearance.              | Medium |

---

## 🚀 0. Open VSX Registry Publishing

- [ ] **Publish `zerotosaas-theme` to Open VSX**:
  - Validate `package.json`: `name`, `version`, `publisher`, `engines`, `categories`, `main`, `contributes`, README, CHANGELOG, and LICENSE.
  - Build the extension package: `npx @vscode/vsce package --no-git-tag-version`.
  - Register or claim the `zerotosaas` namespace at [open-vsx.org](https://open-vsx.org).
  - Generate an Open VSX personal access token (PAT).
  - Install or use `ovsx` directly: `npx ovsx publish <package>.vsix --pat <token>`.
  - Verify the published listing, README, theme previews, and command/setting contributions render correctly.

---

## ⚡ 1. Performance & Architecture Optimizations

- [x] **Debounced Document Change Listener**:
  - Added a 180ms trailing debounce to `vscode.workspace.onDidChangeTextDocument` in `src/extension.js`.
  - Prevents full-document regex re-evaluation on every single keystroke.
- [x] **Debounced Selection Change Listener**:
  - Added a 50ms trailing debounce to `vscode.window.onDidChangeTextEditorSelection`.
- [x] **Asynchronous Version Guards**:
  - Checks `activeEditor.document.version === docVersion` when asynchronous Git blame resolves to prevent applying stale decorations.
- [x] **Large File Safety Threshold**:
  - Added `zerotosaas.maxFileSizeKB` (default: `500` KB) to `package.json` and `src/extension.js`.
  - Automatically bypasses heavy full-file regex passes for oversized files while maintaining diagnostic Error Lens.
- [ ] **Semantic Token Optimization**:
  - Evaluate supplementing regex-based type highlighting with VS Code's native `semanticTokenColors` AST configuration in `scripts/generate-themes.js`.

---

## 🛡️ 2. Digital Security & "Human Firewall" Scanners

- [x] **Expanded High-Entropy Secret Detection**:
  - **AWS Access Keys**: `\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b`
  - **GitHub Personal Access Tokens**: `\bgh[pousr]_[A-Za-z0-9_]{36,255}\b`
  - **Slack Tokens**: `\bxox[baprs]-[0-9a-zA-Z-]{10,72}\b`
  - **JSON Web Tokens (JWT)**: `\beyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*\b`
  - **Private Key Headers**: `-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----`
  - **Google Cloud / Firebase Keys**: `\bAIza[0-9A-Za-z-_]{35}\b`
  - **Bearer Tokens & Multi-DB URIs**: MongoDB, Postgres, Redis, MySQL, AMQP.
- [ ] **Granular Configuration Toggles**:
  - `zerotosaas.statusBadges.detectSecrets` (default: `true`)
  - `zerotosaas.statusBadges.detectHardcodedStrings` (default: `true`)
  - `zerotosaas.statusBadges.detectTypes` (default: `true`)
  - `zerotosaas.statusBadges.detectLogSeverity` (default: `true`)
  - `zerotosaas.statusBadges.detectConfigFiles` (default: `true`)

---

## 👁️ 3. Developer Health & Ocular Ergonomics

- [x] **Interactive 20-20-20 Ocular Rest Assistant**:
  - Opt-in status bar timer (`$(eye) 20m`) based on medical guidelines ([`docs/Guidelines.md`](file:///Users/ram/Work/code/lab/vsx-theme-zerotosaas/docs/Guidelines.md)).
  - Gentle reminder: _"Take a 20-second break to look at an object 20 feet away to relax ciliary eye muscles."_
  - Configuration properties:
    - `zerotosaas.restReminder.enabled` (default: `false`)
    - `zerotosaas.restReminder.intervalMinutes` (default: `20`)
    - `zerotosaas.restReminder.breakDurationSeconds` (default: `20`)
- [ ] **Ambient Light / Circadian Theme Scheduler**:
  - Auto-switch to daytime high-contrast modes during working hours and warmer palettes (e.g. _Warm Sepia_, _Forest Calm_) in the evening.
  - Configuration: `zerotosaas.autoSwitch.enabled`, `zerotosaas.autoSwitch.dayTheme`, `zerotosaas.autoSwitch.nightTheme`.

---

## 🔬 4. Color Science & Advanced Contrast Validation

- [x] **OkLCH (Oklab Color Space) Perceptual Uniformity Engine**:
  - Implemented analytical $sRGB \to LMS \to Oklab \to OkLCH$ conversion in `scripts/validate-contrast.js`.
  - Ensures all 10 themes maintain uniform perceived Lightness ($L \approx 98.3\% - 99.1\%$ canvas, $L \approx 42\% - 45\%$ keywords/accents) and low glare ($C \le 0.010$), eliminating ocular accommodation stress when switching variants.
- [x] **Paul Tol CVD-Safe Wavelength Discrimination Engine**:
  - Implemented analytical $\Delta E_{\text{Ok}}$ perceptual Euclidean distance verification.
  - Mathematically isolates Deuteranopia ($470\text{ nm} / 600\text{ nm}$ Blue/Amber), Protanopia (Magenta/Teal), and Tritanopia (Crimson/Cyan) confusion axes.
- [x] **Cynthia Brewer's ColorBrewer Scale Architecture**:
  - Implemented data-semantic classification across Qualitative (nominal AST classes), Sequential (indent depth levels 1–6), and Diverging (cognitive status & Git diffs) scales in `scripts/validate-contrast.js`.
  - Asserts that visual weight is distributed proportionally without nominal syntactic bias.
- [x] **Farnsworth-Munsell 100-Hue Clinical Quadrant Mapper**:
  - Integrated automated hue-angle ($h^\circ$) classification across the 4 clinical FM 100-Hue quadrants in `scripts/validate-contrast.js`.
  - Validates that alert tokens (Quadrant I), type contracts (Quadrant II), structural keywords (Quadrant III), and function signatures (Quadrant IV) maintain clear angular separation.
- [ ] **APCA (Advanced Perceptual Contrast Algorithm / WCAG 3.0)**:
  - Extend `scripts/validate-contrast.js` to calculate APCA $L^c$ lightness contrast scores alongside traditional WCAG 2.1 AAA (7:1) ratios.
  - Ensure $L^c \ge 75$ for standard syntax tokens and $L^c \ge 90$ for fine text and Error Lens diagnostics.

---

## 🌐 5. Cross-Platform Ecosystem & Design Token Exports

- [ ] **Enterprise SaaS Design Token Exporter (`scripts/export-tokens.js`)**:
  - Export `tokens/zerotosaas.css` with CSS Custom Properties (`--z2s-canvas`, `--z2s-panic-fg`, etc.).
  - Export `tokens/tailwind.preset.js` for web application frontends.
  - Export JSON design tokens compatible with Figma Tokens Studio / Style Dictionary.
- [ ] **Terminal Color Schemes**:
  - **iTerm2**: `.itermcolors`
  - **Windows Terminal**: `settings.json` scheme profiles
  - **Alacritty**: `.toml`
  - **Kitty**: `.conf`
  - **Ghostty / Warp**: theme profiles

---

## 🛠️ 6. User Experience & Command Enhancements

- [ ] **QuickPick Theme Switcher (`zerotosaas.switchTheme`)**:
  - Command Palette action grouping variants by medical and visual categories:
    - 👁️ _Medical / Universal_: Default Light, High Contrast (ISO 9241-303)
    - 🌐 _CVD Accessible_: Deuteranopia, Protanopia, Tritanopia
    - ☕ _Atmospheric / Warm_: Warm Sepia, Golden Sand, Forest Calm, Terracotta, Royal Plum
  - Live preview on QuickPick item focus.
- [ ] **Status Bar Widget**:
  - `$(shield) ZeroToSaaS [AAA]` badge showing active accessibility mode and quick access menu.
