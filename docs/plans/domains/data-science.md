---
layout: default
title: Domain Theme Plan — Data Science & Analytics
---

# Data Science & Analytics Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for data scientists, ML engineers, and analytics developers who work with Jupyter notebooks, data pipelines, statistical code, and visualization libraries.

## Domain-Specific Requirements

1. **Notebook cell distinction** — clear visual separation between code cells, markdown cells, and output cells
2. **Data type semantics** — distinct colors for DataFrames, Series, tensors, and numpy arrays in Python/R
3. **Statistical notation** — enhanced highlighting for mathematical operators, Greek letters, and statistical functions
4. **Visualization code** — special colors for matplotlib/seaborn/plotly function calls and chart parameters
5. **SQL integration** — clear highlighting for SQL queries embedded in Python/R code (magic commands, dbt models)
6. **Data pipeline syntax** — distinct tokens for Airflow DAGs, dbt models, Spark transformations, and Pandas chains

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Data Science Light | `#FCFCFE` | Analytical Blue-White | Clean data exploration |
| Data Science Night | `#0C0F13` | Dark Notebook | Night model training sessions |
| Data Science Warm | `#FCFAF4` | Warm Statistical | Reduced blue light for long analysis |

## Tasks

- [ ] Define 3 data science theme variants (2 light + 1 night) in `scripts/generate-themes.js`
- [ ] Add Jupyter/dbt/Airflow syntax token scopes
- [ ] Add DataFrame/tensor/numpy type highlighting
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all data science variants
- [ ] Add data science variants to interactive gallery
- [ ] Document data science-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- `pnpm run build` and `pnpm run validate` must pass
