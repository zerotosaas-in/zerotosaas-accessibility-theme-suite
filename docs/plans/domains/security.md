---
layout: default
title: Domain Theme Plan — Security & Cybersecurity
---

# Security & Cybersecurity Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for security researchers, penetration testers, and SOC analysts who work with security tooling, exploit code, log analysis, and threat intelligence data.

## Domain-Specific Requirements

1. **Threat level semantics** — enhanced Panic/Warning/Caution/Safe colors aligned with CVSS severity (Critical=Red, High=Orange, Medium=Yellow, Low=Green)
2. **Exploit code readability** — clear highlighting for shellcode, assembly, and exploit payloads with hex/byte distinction
3. **Log analysis emphasis** — optimized ANSI colors for SIEM dashboards, Splunk queries, and security log streams
4. **Secret detection priority** — maximum-contrast Panic highlighting for leaked credentials, API keys, and certificates in code
5. **Network protocol tokens** — distinct colors for IP addresses, ports, MAC addresses, and protocol identifiers
6. **Dark-mode priority** — SOC analysts work in dark environments (security operations center, 24/7 monitoring)

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Security Night | `#0A0D11` | Dark SOC Console | Primary variant for SOC/24-7 monitoring |
| Security Light | `#FCFDFE` | Light Audit | Daytime audit and compliance work |
| Security High Contrast Night | `#000000` | Stark Threat | Maximum contrast for threat analysis |
| Security CVD-Safe Night | `#0E1214` | CVD-Safe Threats | CVD-safe CVSS severity colors |

## Tasks

- [ ] Define 4 security theme variants (1 light + 3 night) in `scripts/generate-themes.js`
- [ ] Add CVSS severity color mapping (Critical/High/Medium/Low)
- [ ] Add network protocol token highlighting (IP, port, MAC, protocol)
- [ ] Enhance secret detection patterns for security-specific credentials
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all security variants
- [ ] Add security variants to interactive gallery
- [ ] Document security-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- CVSS color mapping requires alignment with NIST/FIRST standards
- `pnpm run build` and `pnpm run validate` must pass
