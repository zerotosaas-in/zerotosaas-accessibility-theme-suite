---
layout: default
title: Domain Theme Plan — Education & Research
---

# Education & Research Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for educators, students, and academic researchers who spend extended hours reading code, writing documentation, and reviewing academic papers and data analysis scripts.

## Domain-Specific Requirements

1. **High readability for beginners** — larger effective font size perception through high contrast and clear token differentiation
2. **Pedagogical syntax** — enhanced highlighting for teaching constructs (loop variables, function parameters, return types) to help students identify patterns
3. **Notebook integration** — Jupyter notebook cell boundaries, markdown cells, and output cells with distinct visual treatment
4. **LaTeX/R-Markdown support** — distinct highlighting for mathematical notation, R code blocks, and citation keys
5. **Age-graded ergonomics** — support for younger learners (reduced blue light) and senior researchers (high contrast options)
6. **Distraction-free reading** — muted decorative elements, emphasis on content tokens

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Education Light | `#FCFDFE` | Soft Blue-White | Calm, focused learning environment |
| Education Night | `#0D1014` | Dark Study | Night study sessions |
| Education High Contrast | `#FFFFFF` | Stark Academic | Senior researchers, maximum clarity |
| Education Warm | `#FCFAF5` | Warm Parchment | Reduced blue light for younger learners |

## Tasks

- [ ] Define 4 education theme variants (3 light + 1 night) in `scripts/generate-themes.js`
- [ ] Add Jupyter/LaTeX/R-Markdown syntax token scopes
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all education variants
- [ ] Add education variants to interactive gallery
- [ ] Document education-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- `pnpm run build` and `pnpm run validate` must pass
