# Changelog

All notable changes to the **ZeroToSaaS Accessibility Theme Suite** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
