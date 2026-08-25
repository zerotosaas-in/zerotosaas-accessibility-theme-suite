---
layout: default
title: Domain Theme Plan — Legal & Compliance
---

# Legal & Compliance Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for legal technology developers, compliance engineers, and legal document automation systems who work with contract analysis code, regulatory rule engines, and legal document markup.

## Domain-Specific Requirements

1. **Contract clause semantics** — distinct highlighting for clause types (definitions, obligations, conditions, representations)
2. **Legal citation tokens** — special colors for case citations (e.g., `Smith v. Jones, 123 F.3d 456`), statute references, and regulation citations
3. **Redaction markers** — Panic-level highlighting for PII/PHI patterns (SSN, passport numbers, bank accounts) to prevent accidental exposure in legal documents
4. **Document markup** — enhanced Markdown/XML highlighting for legal document templates
5. **Audit trail emphasis** — distinct colors for timestamp and author metadata in audit log files
6. **Conservative palette** — professional, restrained color choices suitable for legal industry standards

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Legal Light | `#FCFCFB` | Warm Parchment | Echoes legal document tradition |
| Legal Night | `#0E0D0B` | Dark Walnut | Night document review |
| Legal High Contrast | `#FFFFFF` | Stark Compliance | Maximum contrast for contract review |

## Tasks

- [ ] Define 3 legal theme variants (2 light + 1 night) in `scripts/generate-themes.js`
- [ ] Add legal citation and clause syntax token scopes
- [ ] Add PII redaction patterns to secret detection (SSN, passport, bank account)
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all legal variants
- [ ] Add legal variants to interactive gallery
- [ ] Document legal-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- PII pattern detection requires security review
- `pnpm run build` and `pnpm run validate` must pass
