---
layout: default
title: Domain Theme Plan — Medical & Healthcare
---

# Medical & Healthcare Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for healthcare professionals, medical researchers, and clinical software developers who spend extended hours reviewing patient records, medical imaging code, bioinformatics pipelines, and clinical data.

## Domain-Specific Requirements

1. **DICOM-inspired canvas tones** — subtle warm-gray backgrounds that reduce glare during long imaging review sessions
2. **Clinical alert semantics** — enhanced Panic/Warning contrast for critical patient safety alerts (drug interactions, allergy warnings, abnormal lab values)
3. **HL7/FHIR syntax support** — distinct highlighting for medical data interchange formats (HL7 v2, FHIR R4 JSON/XML, CDA)
4. **DICOM tag highlighting** — special token colors for DICOM tag names (group, element, VR)
5. **Red-green de-emphasis** — medical professionals may have color vision deficiency; default to blue/amber alert semantics
6. **HIPAA-safe defaults** — no patient-identifiable colors or patterns; all themes must work with de-identified data views

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Medical Light | `#FBFCFE` | Clinical Blue-White | Clean, sterile, clinical environment |
| Medical Night | `#0D1117` | Dark Clinical Blue | Night shift coding and chart review |
| Medical High Contrast | `#FFFFFF` | Stark Clinical | ISO 9241-303 for long EMR sessions |
| Medical CVD-Safe | `#FAFCFE` | Blue/Amber Alerts | CVD-safe critical alerts |

## Tasks

- [ ] Define 4 medical theme variants (2 light + 2 night) in `scripts/generate-themes.js`
- [ ] Add HL7/FHIR/DICOM syntax token scopes
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Validate APCA L^c thresholds for clinical alert tokens
- [ ] Generate design tokens and terminal schemes for all medical variants
- [ ] Add medical variants to interactive gallery
- [ ] Document medical-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- `pnpm run build` and `pnpm run validate` must pass
- Design review for clinical alert color choices
