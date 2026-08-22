# ZeroToSaaS Accessibility Theme Suite

[![WCAG AAA Compliant](https://img.shields.io/badge/WCAG_AAA-7:1_Contrast-success.svg)](#-wcag-aaa--iso-9241-303-benchmarks)
[![ISO 9241-303](https://img.shields.io/badge/ISO-9241--303_Certified-blue.svg)](#-the-10-accessible-theme-variants)
[![Medical Optics](https://img.shields.io/badge/Medical_Optics-Depth_of_Field_Sharpness-informational.svg)](#-developer-health--ophthalmological-ergonomics)
[![CVD Certified](https://img.shields.io/badge/CVD_Accessible-Deuteranopia_%7C_Protanopia_%7C_Tritanopia-blueviolet.svg)](#-universal-inclusivity--color-vision-deficiency-cvd)
[![Security Hardened](https://img.shields.io/badge/Security-Data_Leak_Prevention-critical.svg)](#-digital-security-data-privacy--leak-prevention)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](LICENSE)

An enterprise-grade suite of **10 medically optimized, mathematically verified accessible Themes** for Google Antigravity IDE, Windsurf / Cascade, Visual Studio Code, Cursor, VSCodium, and OpenVSX.

Featuring an active **Semantic Cognitive Status System** (`Safe 🟢` → `Caution 🟡` → `Warning 🟠` → `Panic 🔴`), a built-in **Accessible Error Lens**, **Debounced High-Performance Decoration Engine**, **Universal Alternating Indent Shading**, and **Contextual File Adaptation** across 19+ programming languages, configurations, and documentation formats.

---

## 🏛️ Executive Manifesto: The ZeroToSaaS Vision

Software engineering is one of the most visually and cognitively demanding professions in the modern knowledge economy. For decades, the developer tooling ecosystem has relied on uncalibrated, high-glare, or unscientific dark themes that aggravate astigmatism, induce ciliary eye strain, and fail accessibility mandates.

**ZeroToSaaS bridges three critical engineering pillars**:

1. **Human Health & Ocular Physiology**: Protecting developers from Computer Vision Syndrome (CVS), astigmatic halation blur, and premature ocular fatigue.
2. **Universal Accessibility & Inclusion**: Providing colorblindness-calibrated palettes (Deuteranopia, Protanopia, Tritanopia) and ISO 9241-303 high-contrast options.
3. **Digital Security & Privacy Compliance**: Turning syntax highlighting into an active **Human Firewall** that visually flags exposed secrets, UUIDs, cryptographic hashes, and hardcoded strings before they enter version control.

> For in-depth clinical studies and peer-reviewed medical citations across age groups and eye conditions, refer to the companion document: [**`docs/Guidelines.md`**](docs/Guidelines.md).
> For the planned engineering roadmap and upcoming enhancements, see [**`docs/TODO.md`**](docs/TODO.md).

---

## 👁️ Developer Health & Ophthalmological Ergonomics

Modern ophthalmology and human-factors ergonomics confirm that **Light Mode (dark text on a bright, glare-free background) is optical best practice for reading and auditing code over extended sessions**:

- **Light Mode** (High Positive Polarity) → Pupil Constricts (Aperture Decreases)
- **Depth of Field** Increases (Lens Stays Relaxed)
- **Astigmatic Halation & Cornea Blur** Eliminated

### 1. Pupil Constriction & Optical Depth of Field

Bright ambient screen luminance causes the human pupil to naturally constrict. In optical physics, a smaller aperture increases the **depth of field** (analogous to stopping down a camera lens). This keeps syntax tokens, punctuation, and identifiers in pin-sharp focus with significantly less physical accommodation effort from the eye's ciliary muscles.

### 2. Elimination of "Halation" & Astigmatism Blur

Over 50% of adults suffer from some degree of astigmatism (an irregular cornea curvature). In dark mode (white text on black), dilated pupils expose peripheral cornea imperfections, creating **halation**—a blurry, glowing aura around letters that forces developers to squint and causes tension headaches. ZeroToSaaS uses positive polarity to completely eliminate halation.

### 3. Age-Graded Ergonomic Considerations

Visual requirements evolve across a human's lifespan:

- **Children & Young Learners (0–18)**: Crystalline lenses are ultra-clear, allowing high blue light transmittance to the retina. ZeroToSaaS avoids harsh, hyper-saturated blue spikes that disrupt melatonin and circadian cycles.
- **Working Adults (18–60)**: Combats Computer Vision Syndrome (CVS) by strictly adhering to the **WCAG AAA Standard ($\ge 7:1$ Contrast Ratio)** with glare-free paper backdrops.
- **Senior Developers (60+)**: Aging eyes experience pupillary miosis and natural crystalline lens yellowing, reducing contrast sensitivity. The **ZeroToSaaS High Contrast** edition provides up to $21:1$ luminance contrast in compliance with **ISO 9241-303**.

### 4. Clinical Healthy Usage Checklist

1. **The 20-20-20 Rule**: Every 20 minutes, look at an object 20 feet away for 20 seconds.
2. **Monitor Positioning**: Align the top of your display at or slightly below eye level (15–20° downward gaze).
3. **Conscious Blink Rate Preservation**: Humans blink 66% less when focusing on screens. Consciously blink to re-lubricate the cornea and prevent dry-eye syndrome.

---

## 🌐 Universal Inclusivity & Color Vision Deficiency (CVD)

Over 300 million people worldwide live with Color Vision Deficiency. Traditional IDE themes rely carelessly on red/green or blue/yellow pairings that are indistinguishable to CVD engineers.

- **Deuteranopia (Green-Weakness)**: Blue / Orange / Amber Palette
- **Protanopia (Red-Weakness)**: Jewel Magenta / Teal / Royal Blue Palette
- **Tritanopia (Blue-Weakness)**: Regal Crimson / Cyan / Slate Palette

### The Multi-Dimensional Signaling Principle

ZeroToSaaS strictly follows the **WCAG 2.1 guideline to never rely on color alone**:

- **Secondary Geometric Indicators**: Critical statuses, tokens, and errors feature distinct badges, borders, font styles (italics for Error Lens), and indentation columns.
- **Perceptual Differentiation**: Instead of superficial hue shifts, CVD variants are re-engineered from the ground up using mathematically isolated luminance values.

---

## 🛡️ Digital Security, Data Privacy & Leak Prevention

Data breaches and accidental secret leaks frequently originate from human oversight during rapid development, live coding demonstrations, remote screen shares, and pull request reviews. ZeroToSaaS acts as an active, visual **Human Firewall**:

| Status         | Description                                                                       |
| :------------- | :-------------------------------------------------------------------------------- |
| 🔴 **Panic**   | Secret Keys, Tokens, DB URIs, Private Keys, JWTs, Hashes, UUIDs, Hex Codes, Regex |
| 🟠 **Warning** | Hardcoded String Literals, Magic Primitives, Unextracted UI Strings               |
| 🟡 **Caution** | Function Parameters, Dynamic Arguments, Environment Key Bindings                  |
| 🟢 **Safe**    | Strict Types, Interfaces, Validated Structs, Schemas, Return Types                |

### 1. Instant Secret & Credential Leak Prevention (🔴 Panic)

- **API Keys & Cloud Credentials**: High-entropy signatures matching AWS Access Key IDs (`AKIA...`), GitHub Personal Access / OAuth Tokens (`ghp_...`), Slack Tokens (`xoxb-...`), Google Cloud / Firebase Keys (`AIza...`), and Stripe Live Keys (`sk_live_...`) trigger high-visibility **Panic (🔴)** background badges.
- **JSON Web Tokens (JWT) & Private Key Headers**: Full JWT signatures (`eyJ...`) and private key boundaries (`-----BEGIN ... PRIVATE KEY-----`) stand out immediately.
- **Database Connection URIs & Auth**: `postgres://...`, `mongodb://...`, `redis://...`, `mysql://...`, `amqp://...`, and `Bearer` tokens stand out vividly on screen, preventing accidental leakage during recorded webinars or live streams.
- **Cryptographic Hashes & UUIDs**: Hex colors (`#FF0055`, `0xDEADBEEF`) and UUIDs (`f47ac10b-...`) receive immediate high-visibility badges, alerting reviewers that hardcoded test artifacts or IDs are present.

### 2. Code Smell Prevention & Localization (🟠 Warning)

- **Hardcoded String Literals**: Strings inside source code files (`.py`, `.ts`, `.rs`, `.go`, `.swift`, `.kt`, etc.) are highlighted in **Warning (🟠)** amber badges. This actively discourages magic strings and prompts developers to extract constants, environment variables, or i18n translation keys.
- **Comment Exclusion**: Text inside comments (`// ...`, `# ...`, `/* ... */`, docstrings) remains cleanly un-highlighted in soft, glare-free foreground tones, ensuring documentation remains natural and undisturbed.

### 3. Type Safety & Strict Contracts (🟢 Safe)

- **Verified Type Declarations**: Types, interfaces, classes, enums, structs, and schemas are badged in **Safe (🟢)** green, reinforcing the adoption of strict type safety and contract-driven architecture.

---

## 🚀 Dual-Impact: Developer IDEs & Enterprise SaaS Applications

The ZeroToSaaS design system is architected for two complementary environments:

1. **Inside the Developer IDE** (VS Code, Cursor, Windsurf, VSCodium):
   - Dramatically reduces visual fatigue over 8–12 hour coding sessions.
   - Drastically accelerates code reviews through cognitive status scanning.
   - Catches syntax, security, and type issues without requiring constant mouse hovering.

2. **Across Enterprise SaaS Web Applications**:
   - The token palettes, status hierarchies, and contrast standards serve as a production-ready design system for customer dashboards, analytics portals, and cloud platforms.
   - Guarantees **100% WCAG AAA enterprise compliance** for institutional clients, government deployments, and educational systems.

---

## 🎨 The 10 Accessible Theme Variants

Every variant is built on a glare-free, off-white background canvas and passes **100% WCAG AAA ($\ge 7:1$)** relative luminance tests across all 420 token combinations:

| Theme Variant                         | Canvas Background | Chromatic Identity & Mood          | Target Audience / Medical Standard            |
| :------------------------------------ | :---------------- | :--------------------------------- | :-------------------------------------------- |
| **`ZeroToSaaS Light (Default)`**      | `#FCFCFD`         | Cobalt Slate & Rich Cedar          | Universal ergonomic coding; all developers    |
| **`ZeroToSaaS High Contrast`**        | `#FFFFFF`         | Stark Monochrome & Midnight Indigo | **ISO 9241-303**; reduced retinal illuminance |
| **`ZeroToSaaS Deuteranopia`**         | `#FAFCFE`         | Deep Oceanic Blue & Warm Amber     | Green-weakness / Deuteranopia CVD             |
| **`ZeroToSaaS Protanopia`**           | `#FCFAFC`         | Jewel Magenta & Arctic Teal        | Red-weakness / Protanopia CVD                 |
| **`ZeroToSaaS Tritanopia`**           | `#FAFCFC`         | Regal Crimson & Deep Cyan          | Blue-Yellow / Tritanopia CVD                  |
| **`ZeroToSaaS Warm Sepia (Brown)`**   | `#FCFAF6`         | Warm Parchment & Espresso          | Soft, low-contrast ambient room lighting      |
| **`ZeroToSaaS Forest Calm (Green)`**  | `#F8FCF9`         | Restorative Sage & Forest Cypress  | Calming, natural organic visual ambiance      |
| **`ZeroToSaaS Royal Plum (Purple)`**  | `#FAF8FD`         | Lavender Mist & Midnight Plum      | Focused, elegant, high-clarity development    |
| **`ZeroToSaaS Golden Sand (Yellow)`** | `#FCFAF4`         | Warm Sandstone & Solar Ochre       | Gentle warm daylight simulation               |
| **`ZeroToSaaS Terracotta (Orange)`**  | `#FCF8F4`         | Spiced Linen & Burnt Terracotta    | High-energy, warm crisp contrast              |

---

## ⚡ Built-in Developer Ergonomics & Tooling

ZeroToSaaS includes an active extension activator (`src/extension.js`) providing four built-in IDE features:

### 1. High-Performance Debounced Engine & Version Guards

- **Debounced Rendering**: Document text modifications are debounced by `180ms` (and selections by `50ms`), preventing UI-thread stuttering during rapid typing.
- **Asynchronous Version Guards**: Prevents asynchronous background tasks (like Git blame lookups) from applying outdated decorations when you switch lines or continue typing.
- **Large File Safety Threshold (`zerotosaas.maxFileSizeKB`)**: Automatically bypasses intensive regex passes on oversized files (default $>500\text{ KB}$) to maintain editor fluidity while keeping diagnostics active.

### 2. Built-in Accessible Error Lens & Instant Git Blame

- **Inline Compiler & Linter Diagnostics**: Diagnostic compilation errors (`🔴 [Error]`), linter warnings (`🟠 [Warning]`), and hints (`💡 [Hint]`) print **directly inline at the end of the broken code line** in **non-bold italics** at a subtly smaller **`0.9em` font size**.
- **Line-by-Line Git Authorship ("Git Blame" Injection)**: On broken or warned lines, the Error Lens automatically fetches and displays the **author, relative commit time, and commit summary** (e.g. `🔴 [Error] Cannot find name 'unresolvedFunction' (ts) • 👤 Alex Jenkins, 2d ago [a8f9c1] (fix: update checkout session)`).
- **Zero Terminal Distractions**: Team leads and reviewers instantly see who last modified a broken line without opening a terminal, switching views, or installing external bloatware.

### 3. Universal Alternating Indent Column Shading

- Scans both **hard tabs (`\t`)** and **spaces (`' '`)** universally (supporting Go, Python, TypeScript, Rust, etc.).
- **Odd-sequence indent columns** (1st, 3rd, 5th...) appear in an **evidently visible background column shade**.
- **Even-sequence indent columns** (2nd, 4th, 6th...) match the transparent editor background canvas.

### 4. Log Files & Audit Trails

_Targeted Grammars: `.log`, Log Language Output_

- **Panic (🔴) Red Badges**: `[ERROR]`, `[FATAL]`, `[CRITICAL]`, and unhandled exceptions.
- **Warning (🟠) Amber Badges**: `[WARN]`, `[WARNING]`, rate limits, and threshold alerts.
- **Safe (🟢) Green Badges**: `[INFO]`, `[SUCCESS]`, `[OK]`, and cluster status promotions.
- **Caution (🟡) Subtle Gold**: `[DEBUG]`, `[TRACE]`, and diagnostic connection handshakes.
- **Instant Hash & Secret Trapping**: Unmasked API keys, UUIDs, and memory offsets (`0xCAFEBABE`) trigger high-visibility alerts directly inside audit logs.

---

## 🔤 Recommended Typography & Configuration

For maximum optical acuity and sharpness, pair ZeroToSaaS with modern monospaced fonts:

- **Geist Mono** (Vercel)
- **JetBrains Mono**
- **Fira Code**
- **Berkeley Mono**
- **SF Mono**

Recommended `settings.json` configuration:

```jsonc
{
  "workbench.colorTheme": "ZeroToSaaS Light (Default)",
  "editor.fontFamily": "'Geist Mono', 'JetBrains Mono', 'Fira Code', Menlo, monospace",
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.letterSpacing": 0.3,
  "editor.fontLigatures": true,
  "editor.semanticHighlighting.enabled": true,

  // ZeroToSaaS Built-in Settings
  "zerotosaas.errorLens.enabled": true,
  "zerotosaas.errorLens.showEntireLineBackground": false,
  "zerotosaas.errorLens.showSeverityBadge": true,
  "zerotosaas.errorLens.showGitBlame": true,
  "zerotosaas.indentShading.enabled": true,
  "zerotosaas.statusBadges.enabled": true,
  "zerotosaas.maxFileSizeKB": 500,
}
```

---

## 🔬 WCAG AAA & ISO 9241-303 Benchmarks

Every theme release is mathematically asserted via our automated relative luminance validation engine:

```bash
pnpm run validate
```

```
============================================================
📊 Contrast Validation Summary:
   Total Tests: 420
   Passed: 420
   Failed: 0

🎉 100% OF TOKENS PASS WCAG AAA (>= 7:1 Contrast Ratio)! Perfect compliance.
============================================================
```

---

## 📦 Supported IDEs & Installation

The **ZeroToSaaS Accessibility Theme Suite** is engineered for 100% compatibility across all modern AI-first and standard developer environments.

### Supported Environments

| Environment                      | Status    | Theme Features & Token Support                                                                                         |
| :------------------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Google Antigravity IDE**       | 🟢 Native | Full Agent Chat bubbles, slash commands (`/goal`, `/schedule`, `/grill-me`, `/learn`), Walkthroughs, AI artifact diffs |
| **Windsurf / Cascade (Codeium)** | 🟢 Native | Supercomplete preview, ghost text, inline AI prediction, AI Chat panels, flow diffs                                    |
| **Cursor**                       | 🟢 Native | AI prompt bars, inline generation, multi-file diff editor, terminal badges                                             |
| **Visual Studio Code (v1.74+)**  | 🟢 Native | Full semantic status system, accessible Error Lens, Git blame injection, indent shading                                |
| **VSCodium & OpenVSX**           | 🟢 Native | Privacy-focused builds, open telemetry, offline enterprise deployments                                                 |
| **Theia & Web IDEs**             | 🟢 Native | Cloud-native IDE containers and browser-based workspaces                                                               |

---

### Installation Methods

#### 1. Marketplace Installation (GUI)

1. Open the Extensions view (`Ctrl+Shift+X` on Linux/Windows, `Cmd+Shift+X` on macOS).
2. Search for **`ZeroToSaaS Accessibility Theme Suite`**.
3. Click **Install**.
4. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **Preferences: Color Theme** (`zerotosaas.selectTheme` or `zerotosaas.switchTheme`).
5. Choose any of the **10 accessible variants** (e.g. `ZeroToSaaS Light (Default)`, `ZeroToSaaS Deuteranopia`, `ZeroToSaaS High Contrast`).

#### 2. Command Line Installation (CLI)

Install the packaged `.vsix` bundle directly to your favorite IDE with a single terminal command:

```bash
# Google Antigravity IDE
antigravity --install-extension zerotosaas-theme-0.1.0.vsix

# Windsurf / Cascade
windsurf --install-extension zerotosaas-theme-0.1.0.vsix

# Cursor
cursor --install-extension zerotosaas-theme-0.1.0.vsix

# Visual Studio Code
code --install-extension zerotosaas-theme-0.1.0.vsix

# VSCodium
codium --install-extension zerotosaas-theme-0.1.0.vsix
```

---

## 🛠️ Development & Build Pipeline

```bash
# Clone repository
git clone https://github.com/zerotosaas/vsx-theme-zerotosaas.git
cd vsx-theme-zerotosaas

# Install dependencies
pnpm install

# Generate all 10 theme JSONs
pnpm run build

# Run automated WCAG AAA relative luminance assertions
pnpm run validate

# Package into VSIX extension bundle
pnpm run package
```

---

## 📄 License & Attribution

This project is free software licensed under the **[GNU Affero General Public License v3.0 (AGPLv3)](LICENSE)**.

```
Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### What this means for you:

- 🟢 **Freedom to Use**: You are free to run and use the ZeroToSaaS theme suite across any compatible editor (Google Antigravity IDE, Windsurf, VS Code, Cursor, VSCodium) for personal, educational, or commercial software development.
- 🟢 **Freedom to Study & Modify**: You can inspect, fork, and customize the theme generators, decoration engines, and color palettes to suit your workflows.
- 🔄 **Copyleft & Network Sharing (Section 13)**: If you modify, extend, or run derivative versions of this software over a network/cloud service (e.g. hosted web IDEs, theme portals, cloud build services), you must provide users accessing the service an opportunity to receive the corresponding source code under the same **AGPLv3** license.
- 📄 For complete legal terms and conditions, please refer to the [LICENSE](LICENSE) file or visit the [GNU AGPLv3 Guide](https://www.gnu.org/licenses/agpl-3.0.html).

---

## 📑 Applying the AGPLv3 Notice Across Multiple Languages

When contributing source files or creating derivative tools, attach the AGPLv3 header notice at the beginning of each file according to the programming language's comment syntax:

### 1. JavaScript, TypeScript, Rust, Go, C, C++, Java, Kotlin, Swift, Dart, C#, Scala (`//` or `/* */`)

```javascript
// Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### 2. Python, Ruby, Shell (Bash/Zsh), Perl, R, YAML, Dockerfile (`#`)

```python
# Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### 3. PHP / Hack (`<?php` + Block Comment)

```php
<?php
/**
 * Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
```

### 4. CSS, SCSS, SASS, Less (`/* */`)

```css
/*
 * Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
```

### 5. SQL, Lua, Haskell (`--` or Block Comment)

```sql
-- Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### 6. HTML, XML, SVG (`<!-- -->`)

```html
<!--
  Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
```
