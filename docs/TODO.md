---
layout: default
title: Engineering Roadmap & Future Milestones
redirect_from:
  - /docs/TODO.md
---

# ZeroToSaaS Theme Suite — Roadmap & TODO

This document outlines prioritized recommendations and planned engineering enhancements for the **ZeroToSaaS Accessibility Theme Suite**.

---

## 📋 Prioritized Enhancement Matrix

| Priority | Category      | Feature / Enhancement                                | Impact                                                                                  | Effort |
| :------- | :------------ | :--------------------------------------------------- | :-------------------------------------------------------------------------------------- | :----- |
| **P1**   | Performance   | **Debounced Decoration Engine & Version Guards**     | Prevents UI thread stuttering on rapid typing and eliminates race conditions.           | Low    |
| **P1**   | Security      | **Extended "Human Firewall" Secret Scanners**        | Traps AWS keys, JWTs, GitHub/Slack tokens, and private key headers.                     | Low    |
| **P2**   | Ergonomics    | **20-20-20 Ocular Rest Assistant & Blink Reminder**  | Integrates clinical break reminders and blink rate calibration into the status bar.     | Medium |
| **P2**   | Configuration | **Granular Status Badge Scanner Toggles**            | Allows developers to selectively toggle secret, string, and type scanning. ✓ Done       | Low    |
| **P2**   | UX / Workflow | **Interactive QuickPick Theme Switcher**             | Dedicated command (`zerotosaas.switchTheme`) with CVD and ambient category previews.    | Low    |
| **P3**   | Validation    | **APCA (WCAG 3.0) & CVD Simulation Suite**           | Adds APCA $L^c$ scoring and programmatic Brettel/Machado colorblindness validation.     | Medium |
| **P3**   | Ecosystem     | **Design Token Exporter (CSS, Tailwind, Terminals)** | Generates CSS custom properties, Tailwind presets, and iTerm2/Alacritty/Kitty profiles. | Medium |
| **P3**   | Ergonomics    | **Ambient Light & Day/Night Theme Auto-Switching**   | Adapts theme based on OS appearance via native `window.autoDetectColorScheme`.          | Medium |

---

## 🧹 7. UX Simplification — Preferences-First, No Reinvented Wheels

Guiding principles:

1. **Prefer native IDE settings over custom solutions.** If VSCodium/VS Code already provides a setting (e.g. `window.autoDetectColorScheme`, `workbench.preferredDarkColorTheme`), use it — do not spin a parallel extension-specific mechanism.
2. **All ZeroToSaaS configuration lives in the Preferences/Settings UI.** Users should not need the Command Palette to toggle features. Every setting (pomodoro, eye-strain reminder, status-badge scanners, error lens, indent shading, etc.) is a `zerotosaas.*` configuration property discoverable and editable in `Ctrl+,` → Extensions → ZeroToSaaS.
3. **Minimise Command Palette surface area.** The palette should expose only actions that are not settings (e.g. "Select Theme" QuickPick, "Open Eye-Health Guidelines"). Toggle commands that merely flip a boolean setting should be removed — the Settings UI is the single source of truth.

- [ ] **Audit all `zerotosaas.*` commands and collapse toggle commands into settings-only**:
  - Remove `zerotosaas.toggleErrorLens`, `zerotosaas.toggleStatusBadges`, `zerotosaas.toggleIndentShading`, `zerotosaas.toggleRestReminder` — these flip a boolean that is already editable in Preferences.
  - Keep only action commands: `zerotosaas.selectTheme` / `zerotosaas.switchTheme` (QuickPick), `zerotosaas.openSettings`, `zerotosaas.openGuidelines`, `zerotosaas.resetRestTimer` (action, not a toggle).
  - Ensure every removed toggle has a corresponding setting in `package.json` `contributes.configuration` so users can configure it from Preferences.
- [ ] **Wellness features (pomodoro, eye-strain, blink coach, Guardian) — settings-only, no command-palette toggles**:
  - When the wellness layer (Phase 1-3 of the wellness plan) is implemented, all toggles (`wellness.guardian.enabled`, `wellness.eyeBreak.enabled`, `wellness.focusFlow.mode`, `wellness.blinkCoach.enabled`, etc.) must be Preferences-only settings.
  - The only wellness commands in the palette should be actions: `zerotosaas.wellness.openHub`, `zerotosaas.wellness.openDashboard`, `zerotosaas.eyeBreak.takeNow`, `zerotosaas.pomodoro.start` / `.pause` / `.stop` / `.skipPhase`.
- [ ] **Replace any extension-specific mechanism that duplicates a native IDE setting**:
  - Already done: removed `zerotosaas.autoSwitch.*` (time-based theme switcher) in favour of `window.autoDetectColorScheme` + `workbench.preferredDarkColorTheme` / `preferredLightColorTheme`.
  - Audit remaining settings for any other duplication of native VS Code/VSCodium capabilities.
- [ ] **Settings UI grouping and ordering**:
  - Organise `package.json` configuration properties with clear `title` scopes (e.g. "ZeroToSaaS — Error Lens", "ZeroToSaaS — Status Badges", "ZeroToSaaS — Wellness") so the Preferences UI groups them logically.
  - Add `order` fields to settings so they appear in a sensible sequence within each group.
  - Write clear, concise `description` strings so users understand each setting without leaving Preferences.

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
- [x] **Semantic Token Optimization**:
  - Expanded `semanticTokenColors` in `scripts/generate-themes.js` from 14 to 60 entries covering the full VS Code semantic token taxonomy (types, functions, variables, properties, parameters, namespaces, modules, constants, strings, keywords, operators, comments, regex, events, deprecated tokens).
  - Offloads syntax highlighting from regex-based TextMate scope matching to VS Code's native AST-based semantic engine for improved rendering performance.
  - Added modifier-based selectors (`.declaration`, `.static`, `.readonly`, `.deprecated`, `.defaultLibrary`, `.documentation`) for granular styling.

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
- [x] **Granular Configuration Toggles**:
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
- [x] **Ambient Light / Circadian Theme Scheduler**:
  - Replaced the custom time-based `zerotosaas.autoSwitch.*` poller with the IDE's native `window.autoDetectColorScheme` + `workbench.preferredDarkColorTheme` / `preferredLightColorTheme` (OS-appearance follow, event-driven, no polling, no conflicts with manual theme choices).
  - On first run, the extension sets the preferred dark/light themes to ZeroToSaaS variants (only if the user hasn't configured them already).
  - See §7 for the broader "prefer native IDE settings" principle.

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
