---
layout: default
title: Domain Theme Plan — DevOps & Infrastructure
---

# DevOps & Infrastructure Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for DevOps engineers, SREs, and platform teams who spend extended hours monitoring dashboards, writing infrastructure-as-code, debugging production incidents, and reviewing log streams.

## Domain-Specific Requirements

1. **Log stream emphasis** — enhanced ANSI color mapping for structured logs (JSON logs, kubectl output, docker compose logs)
2. **Infrastructure-as-code syntax** — distinct highlighting for Terraform, Pulumi, Crossplane, and Kubernetes YAML resources
3. **Incident severity colors** — clear Panic/Warning/Safe semantics for alert rules, PagerDuty integration code, and runbook automation
4. **Diff/patch readability** — enhanced git diff colors for merge conflict resolution during hotfix sessions
5. **Terminal-first design** — optimized terminal ANSI colors for kubectl/helm/terraform CLI output
6. **Dark-mode priority** — DevOps engineers frequently work in dark environments (NOC, on-call at night)

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| DevOps Night | `#0B0E11` | Dark NOC Console | Primary variant for NOC/on-call work |
| DevOps Light | `#FCFDFE` | Light Operations | Daytime infrastructure work |
| DevOps High Contrast Night | `#000000` | Stark Incident | Maximum contrast during incident response |
| DevOps CVD-Safe Night | `#0E1214` | CVD-Safe Alerts | CVD-safe incident severity colors |

## Tasks

- [ ] Define 4 DevOps theme variants (1 light + 3 night) in `scripts/generate-themes.js`
- [ ] Add Terraform/Kubernetes/Helm syntax token scopes
- [ ] Optimize terminal ANSI colors for kubectl/helm/terraform CLI output
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all DevOps variants
- [ ] Add DevOps variants to interactive gallery
- [ ] Document DevOps-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- `pnpm run build` and `pnpm run validate` must pass
