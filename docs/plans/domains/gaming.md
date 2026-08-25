---
layout: default
title: Domain Theme Plan — Gaming & Game Development
---

# Gaming & Game Development Domain Themes — Plan

| Field | Value |
| :--- | :--- |
| **Priority** | P3 |
| **Category** | Domain Themes |
| **Effort** | Medium |
| **Status** | Not started |

---

## Objective

Create a set of ZeroToSaaS theme variants optimized for game developers, engine programmers, and shader engineers who work with C++/Rust game engines, shader code (GLSL/HLSL/WGSL), and game scripting languages.

## Domain-Specific Requirements

1. **Shader syntax** — distinct highlighting for GLSL, HLSL, WGSL types (vec3, mat4, float4x4, sampler2D)
2. **Engine API tokens** — special colors for Unity (C# MonoBehaviour), Unreal (C++ UCLASS), Godot (GDScript) API calls
3. **Performance-critical code** — enhanced visibility for hot paths, SIMD intrinsics, and GPU compute kernels
4. **Asset reference highlighting** — distinct colors for file paths, asset references, and resource URIs
5. **Debug overlay semantics** — Panic/Warning/Safe colors that map to game debug draw colors (red=error, yellow=warning, green=ok)
6. **High-energy palette** — vibrant but accessible colors suited for creative game development environments

## Proposed Variants

| Variant | Canvas | Identity | Rationale |
| :--- | :--- | :--- | :--- |
| Gaming Light | `#FCFCFD` | Vibrant Cobalt | High-energy creative coding |
| Gaming Night | `#0A0C10` | Dark Engine | Dark IDE for shader/graphics work |
| Gaming Purple Night | `#0D0B12` | Neon Midnight | Creative night coding with purple accents |

## Tasks

- [ ] Define 3 gaming theme variants (1 light + 2 night) in `scripts/generate-themes.js`
- [ ] Add GLSL/HLSL/WGSL syntax token scopes
- [ ] Add Unity/Unreal/Godot API highlighting
- [ ] Validate all variants pass WCAG AAA (≥ 7:1)
- [ ] Generate design tokens and terminal schemes for all gaming variants
- [ ] Add gaming variants to interactive gallery
- [ ] Document gaming-specific features in `docs/guides/`

## Dependencies

- WCAG AAA validation must pass for all new variants
- `pnpm run build` and `pnpm run validate` must pass
