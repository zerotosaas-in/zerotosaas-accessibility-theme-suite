---
layout: default
title: Built-in IDE Features & Tooling
---

# ⚡ Built-in Developer Ergonomics & Tooling

ZeroToSaaS includes an active extension activator (`src/extension.js`) providing four built-in IDE features:

---

## 1. High-Performance Debounced Engine & Version Guards

- **Debounced Rendering**: Document text modifications are debounced by `180ms` (and selections by `50ms`), preventing UI-thread stuttering during rapid typing.
- **Asynchronous Version Guards**: Prevents asynchronous background tasks (like Git blame lookups) from applying outdated decorations when you switch lines or continue typing.
- **Large File Safety Threshold (`zerotosaas.maxFileSizeKB`)**: Automatically bypasses intensive regex passes on oversized files (default $>500\text{ KB}$) to maintain editor fluidity while keeping diagnostics active.

## 2. Built-in Accessible Error Lens & Instant Git Blame

- **Inline Compiler & Linter Diagnostics**: Diagnostic compilation errors (`🔴 [Error]`), linter warnings (`🟠 [Warning]`), and hints (`💡 [Hint]`) print **directly inline at the end of the broken code line** in **non-bold italics** at a subtly smaller **`0.9em` font size**.
- **Line-by-Line Git Authorship ("Git Blame" Injection)**: On broken or warned lines, the Error Lens automatically fetches and displays the **author, relative commit time, and commit summary** (e.g. `🔴 [Error] Cannot find name 'unresolvedFunction' (ts) • 👤 Alex Jenkins, 2d ago [a8f9c1] (fix: update checkout session)`).
- **Zero Terminal Distractions**: Team leads and reviewers instantly see who last modified a broken line without opening a terminal, switching views, or installing external bloatware.

## 3. Universal Alternating Indent Column Shading

- Scans both **hard tabs (`\t`)** and **spaces (`' '`)** universally (supporting Go, Python, TypeScript, Rust, etc.).
- **Odd-sequence indent columns** (1st, 3rd, 5th...) appear in an **evidently visible background column shade**.
- **Even-sequence indent columns** (2nd, 4th, 6th...) match the transparent editor background canvas.

## 4. Log Files & Audit Trails

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

## 📦 Supported IDEs

The **ZeroToSaaS Accessibility Theme Suite** is engineered for 100% compatibility across all modern AI-first and standard developer environments.

| Environment                      | Status    | Theme Features & Token Support                                                                                         |
| :------------------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Google Antigravity IDE**       | 🟢 Native | Full Agent Chat bubbles, slash commands (`/goal`, `/schedule`, `/grill-me`, `/learn`), Walkthroughs, AI artifact diffs |
| **Windsurf / Cascade (Codeium)** | 🟢 Native | Supercomplete preview, ghost text, inline AI prediction, AI Chat panels, flow diffs                                    |
| **Cursor**                       | 🟢 Native | AI prompt bars, inline generation, multi-file diff editor, terminal badges                                             |
| **Visual Studio Code (v1.74+)**  | 🟢 Native | Full semantic status system, accessible Error Lens, Git blame injection, indent shading                                |
| **VSCodium & OpenVSX**           | 🟢 Native | Privacy-focused builds, open telemetry, offline enterprise deployments                                                 |
| **Theia & Web IDEs**             | 🟢 Native | Cloud-native IDE containers and browser-based workspaces                                                               |

### Installation

#### Marketplace (GUI)

1. Open the Extensions view (`Ctrl+Shift+X` on Linux/Windows, `Cmd+Shift+X` on macOS).
2. Search for **`ZeroToSaaS Accessibility Theme Suite`**.
3. Click **Install**.
4. Open the Color Theme picker (`Ctrl+K Ctrl+T` / `Cmd+K Cmd+T`) and select any of the **20 accessible variants**.

#### Command Line (CLI)

```bash
# Google Antigravity IDE
antigravity --install-extension zerotosaas-theme-0.3.0.vsix

# Windsurf / Cascade
windsurf --install-extension zerotosaas-theme-0.3.0.vsix

# Cursor
cursor --install-extension zerotosaas-theme-0.3.0.vsix

# Visual Studio Code
code --install-extension zerotosaas-theme-0.3.0.vsix

# VSCodium
codium --install-extension zerotosaas-theme-0.3.0.vsix
```
