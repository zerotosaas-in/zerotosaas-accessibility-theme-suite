---
layout: default
title: Digital Security, Data Privacy & Leak Prevention
---

# 🛡️ Digital Security, Data Privacy & Leak Prevention

Data breaches and accidental secret leaks frequently originate from human oversight during rapid development, live coding demonstrations, remote screen shares, and pull request reviews. ZeroToSaaS acts as an active, visual **Human Firewall**:

| Status         | Description                                                                       |
| :------------- | :-------------------------------------------------------------------------------- |
| 🔴 **Panic**   | Secret Keys, Tokens, DB URIs, Private Keys, JWTs, Hashes, UUIDs, Hex Codes, Regex |
| 🟠 **Warning** | Hardcoded String Literals, Magic Primitives, Unextracted UI Strings               |
| 🟡 **Caution** | Function Parameters, Dynamic Arguments, Environment Key Bindings                  |
| 🟢 **Safe**    | Strict Types, Interfaces, Validated Structs, Schemas, Return Types                |

---

## 1. Instant Secret & Credential Leak Prevention (🔴 Panic)

- **API Keys & Cloud Credentials**: High-entropy signatures matching AWS Access Key IDs (`AKIA...`), GitHub Personal Access / OAuth Tokens (`ghp_...`), Slack Tokens (`xoxb-...`), Google Cloud / Firebase Keys (`AIza...`), and Stripe Live Keys (`sk_live_...`, `pk_live_...`) trigger high-visibility **Panic (🔴)** background badges.
- **JSON Web Tokens (JWT) & Private Key Headers**: Full JWT signatures (`eyJ...`) and private key boundaries (`-----BEGIN ... PRIVATE KEY-----`) stand out immediately.
- **Database Connection URIs & Auth**: `postgres://...`, `mongodb://...`, `redis://...`, `mysql://...`, `amqp://...`, and `Bearer` tokens stand out vividly on screen, preventing accidental leakage during recorded webinars or live streams.
- **Cryptographic Hashes & UUIDs**: Hex colors (`#FF0055`, `0xDEADBEEF`) and UUIDs (`f47ac10b-...`) receive immediate high-visibility badges, alerting reviewers that hardcoded test artifacts or IDs are present.

## 2. Code Smell Prevention & Localization (🟠 Warning)

- **Hardcoded String Literals**: Strings inside source code files (`.py`, `.ts`, `.rs`, `.go`, `.swift`, `.kt`, etc.) are highlighted in **Warning (🟠)** amber badges. This actively discourages magic strings and prompts developers to extract constants, environment variables, or i18n translation keys.
- **Comment Exclusion**: Text inside comments (`// ...`, `# ...`, `/* ... */`, docstrings) remains cleanly un-highlighted in soft, glare-free foreground tones, ensuring documentation remains natural and undisturbed.

## 3. Type Safety & Strict Contracts (🟢 Safe)

- **Verified Type Declarations**: Types, interfaces, classes, enums, structs, and schemas are badged in **Safe (🟢)** green, reinforcing the adoption of strict type safety and contract-driven architecture.

---

## Granular Scanner Toggles

Each scanner category can be independently toggled via Settings (`Ctrl+,` → Extensions → ZeroToSaaS):

| Setting | Default | Description |
| :--- | :--- | :--- |
| `zerotosaas.statusBadges.detectSecrets` | `true` | AWS keys, GitHub/Slack PATs, JWTs, private keys, Stripe keys, GCP keys, Bearer tokens, database URIs |
| `zerotosaas.statusBadges.detectHardcodedStrings` | `true` | Non-secret hardcoded quoted strings in source code |
| `zerotosaas.statusBadges.detectTypes` | `true` | Type definitions, function parameters, Markdown inline code |
| `zerotosaas.statusBadges.detectLogSeverity` | `true` | Log severity keywords (FATAL, ERROR, WARN, INFO, DEBUG) in `.log` files |
| `zerotosaas.statusBadges.detectConfigFiles` | `true` | Sensitive configuration keys (SECRET, TOKEN, KEY, PASSWORD) in TOML/YAML/JSON/INI |
