---
layout: default
title: Requirement Spec — Status Bar Widget
---

# Status Bar Widget — Requirement Specification

| Field | Value |
| :--- | :--- |
| **Priority** | P2 |
| **Category** | UX |
| **Effort** | Low |
| **Status** | Not started |

---

## Objective

Add a persistent status bar widget showing `$(shield) ZeroToSaaS [AAA]` with a quick-access menu.

## Current State

A `restStatusBar` item exists in `src/extension.js:1188` but only appears during active 20-20-20 breaks (`$(eye) break` / `$(eye) 23s break`). There is no persistent badge.

## Requirements

1. **Persistent status bar item** on the right side showing `$(shield) ZeroToSaaS [AAA]`
2. **Click handler** opens a QuickPick with:
   - "Open Settings" — calls `zerotosaas.openSettings`
   - "Open Eye-Health Guidelines" — calls `zerotosaas.openGuidelines`
   - "Reset 20-20-20 Rest Timer" — calls `zerotosaas.resetRestTimer`
   - Informational entry: "Active theme: \<name\>"
3. **Forward compatibility**: the wellness plan (Phase 1, P1.4) specifies a "unified status-bar hub" — this widget must be built lightweight so the wellness layer can absorb/extend it without conflict.

## Implementation Notes

- Use `vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)`
- Show/hide based on a setting (e.g. `zerotosaas.statusBar.enabled`, default `true`)
- Update the theme name display when the active color theme changes

## Dependencies

- None (can be implemented independently)
