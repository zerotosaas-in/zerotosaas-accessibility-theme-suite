---
layout: default
title: Requirement Spec — Settings UI Grouping & Ordering
---

# Settings UI Grouping & Ordering — Requirement Specification

| Field | Value |
| :--- | :--- |
| **Priority** | P2 |
| **Category** | Configuration |
| **Effort** | Low |
| **Status** | Not started (deferred until wellness settings exist) |

---

## Objective

Organise `package.json` configuration properties with scoped `title` groups and `order` fields so the Preferences UI groups settings logically.

## Current State

All 16 settings are under a single `"title": "ZeroToSaaS Theme Suite"` group in `package.json`. No `order` fields exist on any setting.

## Requirements

1. **Split the single `configuration` block** into multiple scoped blocks with distinct `title` values:
   - "ZeroToSaaS — Error Lens"
   - "ZeroToSaaS — Status Badges"
   - "ZeroToSaaS — Indent Shading"
   - "ZeroToSaaS — Rest Reminder"
   - "ZeroToSaaS — Wellness" (future, when wellness layer is implemented)
2. **Add `order` fields** to each setting so they appear in a sensible sequence within each group.
3. **Write clear, concise `description` strings** so users understand each setting without leaving Preferences.

## Implementation Notes

- VS Code supports multiple `configuration` entries in the `contributes.configuration` array, each with its own `title` and `properties`.
- The `order` field is a number; lower numbers appear first.
- This was previously deferred until wellness settings could be grouped together. It can now be done for existing settings, with the wellness group added later.

## Dependencies

- None for existing settings
- Wellness layer implementation for the wellness settings group
