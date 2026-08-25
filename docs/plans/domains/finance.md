---
layout: default
title: Domain Theme Plan — Finance, Banking & Trading
---

# Finance, Banking & Trading Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for financial software developers, quantitative analysts, and trading platform engineers who work with market data feeds, trading algorithms, risk models, and regulatory compliance code.

## Domain-Specific Requirements

1. **Market semantics** — green/red polarity must be unambiguous for bull/bear market indicators, but with CVD-safe alternatives (blue/amber for Deuteranopia variant)
2. **Numeric precision emphasis** — enhanced contrast for numeric literals, decimal points, and currency symbols to prevent misreading financial figures
3. **FIX protocol syntax** — distinct highlighting for FIX tag-value pairs (Tag 55=Symbol, Tag 44=Price, etc.)
4. **Smart order router tokens** — special colors for order types (MARKET, LIMIT, STOP, ICEBERG)
5. **Regulatory compliance markers** — Caution/Warning badges for SOX, MiFID II, Dodd-Frank annotation requirements
6. **Low-latency code emphasis** — enhanced visibility for performance-critical code paths (hot loops, lock-free structures)

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Finance Light | `#FCFDFE` | Bloomberg-Inspired Amber/Blue | Familiar to financial terminal users |
| Finance Night | `#0C0E12` | Dark Trading Desk | Night trading sessions, reduced eye strain |
| Finance High Contrast | `#FFFFFF` | Stark Compliance | Regulatory code review with maximum contrast |
| Finance CVD-Safe | `#FAFCFE` | Blue/Amber Market | CVD-safe bull/bear indicators |

## Tasks

- [ ] Define 4 finance theme variants (2 light + 2 night) in `scripts/generate-themes.js`
- [ ] Add FIX protocol and financial data syntax token scopes
- [ ] Ensure market semantic colors (bull/bear) are CVD-distinguishable
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all finance variants
- [ ] Add finance variants to interactive gallery
- [ ] Document finance-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- CVD-safe market semantic colors require design review
- `pnpm run build` and `pnpm run validate` must pass
