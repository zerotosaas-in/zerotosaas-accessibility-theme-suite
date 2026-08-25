---
layout: default
title: Requirement Spec — Native-Setting Duplication Audit
---

# Native-Setting Duplication Audit — Requirement Specification

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Configuration |
| **Effort** | Low |
| **Status** | Mostly done — formal audit pending |

---

## Objective

Audit remaining `zerotosaas.*` settings for any duplication of native VS Code/VSCodium capabilities.

## Current State

The main duplication (`zerotosaas.autoSwitch.*` time-based theme switcher) was already removed in v0.2.0 in favor of `window.autoDetectColorScheme` + `workbench.preferredDarkColorTheme` / `preferredLightColorTheme`. The extension now only sets these on first run (if not already configured by the user).

## Requirements

1. **Formal audit** of all 16 remaining `zerotosaas.*` settings against native VS Code/VSCodium capabilities.
2. **Document the audit result** — which settings are unique to ZeroToSaaS (no native equivalent), and which potentially overlap.
3. **Remove or defer to native** any setting that duplicates a native capability.

## Settings to Audit

| Setting | Native Equivalent? | Notes |
| :--- | :--- | :--- |
| `zerotosaas.errorLens.enabled` | No | VS Code has no built-in inline error lens |
| `zerotosaas.errorLens.showEntireLineBackground` | No | |
| `zerotosaas.errorLens.showSeverityBadge` | No | |
| `zerotosaas.errorLens.showGitBlame` | Partial | VS Code has `editor.codeLens` but not inline blame on errors |
| `zerotosaas.indentShading.enabled` | No | VS Code has `editor.guides.indentation` but ZeroToSaaS uses alternating column shading |
| `zerotosaas.statusBadges.enabled` | No | |
| `zerotosaas.statusBadges.detectSecrets` | No | |
| `zerotosaas.statusBadges.detectHardcodedStrings` | No | |
| `zerotosaas.statusBadges.detectTypes` | No | |
| `zerotosaas.statusBadges.detectLogSeverity` | No | |
| `zerotosaas.statusBadges.detectConfigFiles` | No | |
| `zerotosaas.maxFileSizeKB` | No | |
| `zerotosaas.restReminder.enabled` | No | VS Code has no built-in rest reminder |
| `zerotosaas.restReminder.intervalMinutes` | No | |
| `zerotosaas.restReminder.breakDurationSeconds` | No | |
| `zerotosaas.wellness.darkAdvisory.suppressed` | No | |

## Preliminary Conclusion

No remaining settings appear to duplicate native VS Code/VSCodium capabilities. The `indentShading` feature is similar to `editor.guides.indentation` but uses a different visual approach (alternating column shading vs. thin guide lines). The `errorLens.showGitBlame` is partially similar to `editor.codeLens` but applies only to error/warning lines, not all lines.

## Dependencies

- None
