---
layout: default
title: Engineering Roadmap & Future Milestones
redirect_from:
  - /docs/TODO.md
---

# ZeroToSaaS Theme Suite — Roadmap & TODO

This document tracks **remaining engineering work** for the **ZeroToSaaS Accessibility Theme Suite**. Completed items have been removed; the full commit history and [`CHANGELOG.md`](../CHANGELOG.md) serve as the historical record.

---

## 📋 Prioritized Enhancement Matrix (Remaining)

| Priority | Category      | Feature / Enhancement                                                        | Impact                                                                                                                                             | Effort |
| :------- | :------------ | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| **P2**   | Ergonomics    | **Wellness Layer (Guardian, Eye-Break v2, Blink Coach, FocusFlow/Pomodoro)** | Active behavioral health layer: continuous-work Guardian, idle-aware ocular rest, blink lubrication cues, and Pomodoro fused with 20-20-20 breaks. | High   |
| **P2**   | UX            | **Status Bar Widget**                                                        | `$(shield) ZeroToSaaS [AAA]` badge with quick-access menu.                                                                                         | Low    |
| **P2**   | Configuration | **Settings UI Grouping & Ordering**                                          | Scoped `title` groups + `order` fields in `package.json` so Preferences groups settings logically.                                                 | Low    |
| **P3**   | Configuration | **Native-Setting Duplication Audit**                                         | Audit remaining `zerotosaas.*` settings for any other duplication of native VS Code/VSCodium capabilities.                                         | Low    |
| **P3**   | Validation    | **APCA Gap Remediation (Palette Audit)**                                     | Close the 400 APCA L^c gaps catalogued in [`docs/apca-gaps.json`](apca-gaps.json) by adjusting palette colors to meet WCAG 3.0 draft thresholds.   | Medium |

---

## 🧹 7. UX Simplification — Preferences-First, No Reinvented Wheels

Guiding principles:

1. **Prefer native IDE settings over custom solutions.** If VSCodium/VS Code already provides a setting (e.g. `window.autoDetectColorScheme`, `workbench.preferredDarkColorTheme`), use it — do not spin a parallel extension-specific mechanism.
2. **All ZeroToSaaS configuration lives in the Preferences/Settings UI.** Users should not need the Command Palette to toggle features. Every setting (pomodoro, eye-strain reminder, status-badge scanners, error lens, indent shading, etc.) is a `zerotosaas.*` configuration property discoverable and editable in `Ctrl+,` → Extensions → ZeroToSaaS.
3. **Minimise Command Palette surface area.** The palette should expose only actions that are not settings (e.g. "Open Eye-Health Guidelines"). Toggle commands that merely flip a boolean setting should be removed — the Settings UI is the single source of truth.

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

## 👁️ 3. Developer Health — Wellness Layer

The wellness layer is the largest remaining effort. The full design, architecture, configuration reference, command reference, and phased implementation task list (Phases 0–5, ~25 subtasks) are specified in:

> **[`docs/plans/wellness-and-focus-report.md`](plans/wellness-and-focus-report.md)** — _Human-Centered Wellness & Focus Report_
>
> §11 contains the executable task list:
>
> - **Phase 0** — Correctness & de-nag (small, immediate: `hintLensDecorationType` fix, dark-advisory dedupe, remove `"Linters"` category)
> - **Phase 1** — Wellness core + Guardian safety net (`src/wellness/` modules, activity signals, Guardian, unified status-bar hub, unit tests, settings schema)
> - **Phase 2** — Eye suite v2 + FocusFlow (idle-aware eye breaks, blink coach, Pomodoro machine, fusion logic, hub QuickPick)
> - **Phase 3** — Insights & onboarding (stats dashboard, walkthrough, movement & hydration nudges)
> - **Phase 4** — Polish & publication (copy extraction, optional chime, publish `docs/Wellness.md`, release)
> - **Phase 5** — Cross-surface tokens & IDE config completion

The existing 20-20-20 Ocular Rest Assistant (`src/extension.js`) is a minimal wall-clock timer that will be ported behind the new engine; legacy settings will keep working.

---

## 🔬 4. Color Science — APCA Gap Remediation

APCA 0.0.98G (WCAG 3.0 draft) L^c scoring is implemented in `scripts/validate-contrast.js` with a **soft gate**: WCAG 2.1 AAA (7:1) remains the hard build gate, while APCA gaps are tracked but do not fail the build.

- [ ] **Close APCA gaps** (palette audit):
  - 400 gaps are catalogued in [`docs/apca-gaps.json`](apca-gaps.json) — 293 body text (|L^c| < 75), 77 fine text (|L^c| < 90), 30 non-text UI (|L^c| < 60).
  - Gaps are concentrated in night themes (dark-bg/light-text polarity, where APCA scores are naturally lower than WCAG ratios for the same pairs).
  - Closing these requires adjusting palette token colors — a separate effort that needs design review since it modifies theme colors across all 20 variants.

---

## 🛠️ 6. User Experience & Command Enhancements

- [ ] **Status Bar Widget**:
  - `$(shield) ZeroToSaaS [AAA]` badge showing active accessibility mode and quick access menu.
  - Clicking the widget opens a QuickPick with existing actions: "Open Settings", "Open Eye-Health Guidelines", "Reset 20-20-20 Rest Timer", plus an informational "Active theme: \<name\>" entry.
  - Forward-compat: the wellness plan (Phase 1, P1.4) specifies a "unified status-bar hub" — this widget should be built lightweight so the wellness layer can absorb/extend it without conflict.
