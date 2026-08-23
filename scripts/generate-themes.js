// Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const fs = require('fs');
const path = require('path');
const { invertLightness, deriveDarkCanvasStack, hexToOklch, oklchToHex, contrastRatio } = require('./color-math');

const THEMES_DIR = path.join(__dirname, '..', 'themes');
if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}

// 10 Theme Palette Definitions with Lighter, Glare-Free Backgrounds & Deep Chromatic Identity
const themeDefinitions = [
  {
    id: 'zerotosaas-light',
    name: 'ZeroToSaaS Light (Default)',
    type: 'light',
    // Core Cobalt Slate Identity (Lighter Canvas)
    bg: '#FCFCFD',
    bgSubtle: '#F6F8FB',
    bgSidebar: '#F3F6FA',
    bgActivityBar: '#ECF1F7',
    bgStatusBar: '#0B4F9C',
    fgStatusBar: '#FFFFFF',
    bgActive: '#E5EDF7',
    bgSelection: '#B8D6F8B3',
    border: '#D8E1ED',
    borderStrong: '#B4C4DA',
    fg: '#111827',
    fgMuted: '#485260',
    accent: '#0B4F9C',
    accentFocus: '#003D99',
    safe: { fg: '#0B6229', bg: '#F1FAF3', border: '#B4E6C3' },
    caution: { fg: '#784A00', bg: '#FEF9EE', border: '#FDE4A3' },
    warning: { fg: '#8C3800', bg: '#FFF6EE', border: '#FDCBA6' },
    panic: { fg: '#990014', bg: '#FFF2F2', border: '#FCA5A5' },
    syntax: {
      keyword: '#0B4F9C',
      string: '#8C3800',
      function: '#4F2683',
      type: '#0B6229',
      constant: '#784A00',
      number: '#990014',
      variable: '#111827',
      parameter: '#784A00',
      comment: '#485260',
      tag: '#0B4F9C',
      attribute: '#4F2683',
      property: '#111827',
      operator: '#111827',
      regex: '#990014',
      uuid: '#990014',
      secret: '#990014'
    }
  },
  {
    id: 'zerotosaas-high-contrast',
    name: 'ZeroToSaaS High Contrast (ISO 9241-303)',
    type: 'hc-light',
    bg: '#FFFFFF',
    bgSubtle: '#F7F7F7',
    bgSidebar: '#FAFAFA',
    bgActivityBar: '#F2F2F2',
    bgStatusBar: '#000000',
    fgStatusBar: '#FFFFFF',
    bgActive: '#E5E5E5',
    bgSelection: '#A6CEF8E6',
    border: '#000000',
    borderStrong: '#000000',
    fg: '#000000',
    fgMuted: '#444444',
    accent: '#002D80',
    accentFocus: '#001F5C',
    safe: { fg: '#00591E', bg: '#EBF8EE', border: '#000000' },
    caution: { fg: '#5E3800', bg: '#FEF7E2', border: '#000000' },
    warning: { fg: '#7A2E00', bg: '#FFF0E5', border: '#000000' },
    panic: { fg: '#8B0000', bg: '#FFEBEB', border: '#000000' },
    syntax: {
      keyword: '#002D80',
      string: '#7A2E00',
      function: '#4B0082',
      type: '#00591E',
      constant: '#5E3800',
      number: '#8B0000',
      variable: '#000000',
      parameter: '#5E3800',
      comment: '#444444',
      tag: '#002D80',
      attribute: '#4B0082',
      property: '#000000',
      operator: '#000000',
      regex: '#8B0000',
      uuid: '#8B0000',
      secret: '#8B0000'
    }
  },
  {
    id: 'zerotosaas-deuteranopia',
    name: 'ZeroToSaaS Deuteranopia (Blue / Orange)',
    type: 'light',
    // Strong Oceanic Blue & Warm Amber (Lighter Canvas)
    bg: '#FAFCFE',
    bgSubtle: '#F2F6FC',
    bgSidebar: '#EFF4FA',
    bgActivityBar: '#E8F0F7',
    bgStatusBar: '#0043A4',
    fgStatusBar: '#FFFFFF',
    bgActive: '#DCE7F4',
    bgSelection: '#B4D2F8B3',
    border: '#C8D9EE',
    borderStrong: '#9CBADF',
    fg: '#0A1B38',
    fgMuted: '#3D5270',
    accent: '#0043A4',
    accentFocus: '#003180',
    safe: { fg: '#0043A4', bg: '#F1F6FE', border: '#A6CEFD' },
    caution: { fg: '#733500', bg: '#FEF8F1', border: '#FED5B2' },
    warning: { fg: '#7D3800', bg: '#FFF8F1', border: '#FEC99A' },
    panic: { fg: '#8A2500', bg: '#FFF4EF', border: '#FFB899' },
    syntax: {
      keyword: '#0043A4',
      string: '#7D3800',
      function: '#1E3A8A',
      type: '#0043A4',
      constant: '#733500',
      number: '#8A2500',
      variable: '#0A1B38',
      parameter: '#733500',
      comment: '#3D5270',
      tag: '#0043A4',
      attribute: '#1E3A8A',
      property: '#0A1B38',
      operator: '#0A1B38',
      regex: '#8A2500',
      uuid: '#8A2500',
      secret: '#8A2500'
    }
  },
  {
    id: 'zerotosaas-protanopia',
    name: 'ZeroToSaaS Protanopia (Magenta / Teal)',
    type: 'light',
    // Jewel Magenta & Arctic Teal (Lighter Canvas)
    bg: '#FCFAFC',
    bgSubtle: '#F7F2F8',
    bgSidebar: '#F4EEF5',
    bgActivityBar: '#ECE4EE',
    bgStatusBar: '#8C0064',
    fgStatusBar: '#FFFFFF',
    bgActive: '#E4DAE6',
    bgSelection: '#E2C8F0B3',
    border: '#DFC9E3',
    borderStrong: '#C5A3CA',
    fg: '#1E0E22',
    fgMuted: '#624769',
    accent: '#0A4BA0',
    accentFocus: '#003478',
    safe: { fg: '#015D53', bg: '#F1FAF8', border: '#A3ECE0' },
    caution: { fg: '#703700', bg: '#FEF8F0', border: '#FDDDB0' },
    warning: { fg: '#7D3800', bg: '#FFF7F0', border: '#FDCD9E' },
    panic: { fg: '#8C0064', bg: '#FDF2F9', border: '#F9B7E3' },
    syntax: {
      keyword: '#0A4BA0',
      string: '#7D3800',
      function: '#8C0064',
      type: '#015D53',
      constant: '#703700',
      number: '#8C0064',
      variable: '#1E0E22',
      parameter: '#703700',
      comment: '#624769',
      tag: '#0A4BA0',
      attribute: '#8C0064',
      property: '#1E0E22',
      operator: '#1E0E22',
      regex: '#8C0064',
      uuid: '#8C0064',
      secret: '#8C0064'
    }
  },
  {
    id: 'zerotosaas-tritanopia',
    name: 'ZeroToSaaS Tritanopia (Crimson / Cyan)',
    type: 'light',
    // Arctic Cyan & Regal Crimson (Lighter Canvas)
    bg: '#FAFCFC',
    bgSubtle: '#F1F7F8',
    bgSidebar: '#EDF5F6',
    bgActivityBar: '#E3EFF1',
    bgStatusBar: '#A00028',
    fgStatusBar: '#FFFFFF',
    bgActive: '#D6E7EA',
    bgSelection: '#B4E2EAB3',
    border: '#C0D9DE',
    borderStrong: '#90B8C0',
    fg: '#0F1E21',
    fgMuted: '#405B60',
    accent: '#A00028',
    accentFocus: '#7A001E',
    safe: { fg: '#005D6B', bg: '#F1FAF9', border: '#A6E5EE' },
    caution: { fg: '#543D00', bg: '#FEF9EC', border: '#FCE6A8' },
    warning: { fg: '#941800', bg: '#FFF3EE', border: '#FFC8B8' },
    panic: { fg: '#A00028', bg: '#FEF1F3', border: '#FBBCC9' },
    syntax: {
      keyword: '#A00028',
      string: '#941800',
      function: '#800030',
      type: '#005D6B',
      constant: '#543D00',
      number: '#A00028',
      variable: '#0F1E21',
      parameter: '#543D00',
      comment: '#405B60',
      tag: '#A00028',
      attribute: '#800030',
      property: '#0F1E21',
      operator: '#0F1E21',
      regex: '#A00028',
      uuid: '#A00028',
      secret: '#A00028'
    }
  },
  {
    id: 'zerotosaas-brown',
    name: 'ZeroToSaaS Warm Sepia (Brown)',
    type: 'light',
    // Rich Warm Parchment & Deep Roasted Espresso
    bg: '#FCFAF6',
    bgSubtle: '#F6F0E7',
    bgSidebar: '#F3EDE2',
    bgActivityBar: '#EBE3D6',
    bgStatusBar: '#4E2606',
    fgStatusBar: '#FFFFFF',
    bgActive: '#DFD3C0',
    bgSelection: '#E2CEAFB3',
    border: '#D2BEA3',
    borderStrong: '#AB9270',
    fg: '#221206',
    fgMuted: '#5E4832',
    accent: '#5C2C06',
    accentFocus: '#3F1C02',
    safe: { fg: '#1E6029', bg: '#F2FAF3', border: '#B8E5BE' },
    caution: { fg: '#5A3602', bg: '#FEF8EB', border: '#FDE0A8' },
    warning: { fg: '#662E03', bg: '#FFF5EB', border: '#FDC498' },
    panic: { fg: '#8C1004', bg: '#FEF1EE', border: '#FBBDB0' },
    syntax: {
      keyword: '#5C2C06',
      string: '#6C3406',
      function: '#4A2207',
      type: '#3E270E',
      constant: '#613308',
      number: '#8C1004',
      variable: '#221206',
      parameter: '#5A340A',
      comment: '#5E4B38',
      tag: '#5C2C06',
      attribute: '#4A2207',
      property: '#221206',
      operator: '#221206',
      regex: '#8C1004',
      uuid: '#8C1004',
      secret: '#8C1004'
    }
  },
  {
    id: 'zerotosaas-green',
    name: 'ZeroToSaaS Forest Calm (Green)',
    type: 'light',
    // Rich Botanical Forest & Emerald Pine
    bg: '#F8FCF9',
    bgSubtle: '#EDF6F0',
    bgSidebar: '#E8F2EB',
    bgActivityBar: '#DEECE2',
    bgStatusBar: '#084E29',
    fgStatusBar: '#FFFFFF',
    bgActive: '#CCE4D3',
    bgSelection: '#A8DFBFB3',
    border: '#B6DCC1',
    borderStrong: '#7FBA93',
    fg: '#0A2014',
    fgMuted: '#2B583C',
    accent: '#096032',
    accentFocus: '#054523',
    safe: { fg: '#095E31', bg: '#EAF8EE', border: '#97E2B4' },
    caution: { fg: '#4B4D00', bg: '#FEFAEB', border: '#FCE7A6' },
    warning: { fg: '#6A4100', bg: '#FFF6EB', border: '#FDC79B' },
    panic: { fg: '#960C1B', bg: '#FEF1F2', border: '#FBBBC2' },
    syntax: {
      keyword: '#0A6233',
      string: '#1F5A14',
      function: '#0A5C4A',
      type: '#06522B',
      constant: '#145524',
      number: '#8C1224',
      variable: '#0A2014',
      parameter: '#2E5918',
      comment: '#32583E',
      tag: '#0A6233',
      attribute: '#0A5C4A',
      property: '#0A2014',
      operator: '#0A2014',
      regex: '#960C1B',
      uuid: '#960C1B',
      secret: '#960C1B'
    }
  },
  {
    id: 'zerotosaas-purple',
    name: 'ZeroToSaaS Royal Plum (Purple)',
    type: 'light',
    // Elegant Lavender Mist & Royal Plum (Lighter Canvas)
    bg: '#FAF8FD',
    bgSubtle: '#F2EDF7',
    bgSidebar: '#EDE6F3',
    bgActivityBar: '#E4DCEB',
    bgStatusBar: '#5B2188',
    fgStatusBar: '#FFFFFF',
    bgActive: '#D9CDE2',
    bgSelection: '#D8C2F2B3',
    border: '#CBBED5',
    borderStrong: '#A38DB4',
    fg: '#1A0E26',
    fgMuted: '#5A486F',
    accent: '#5B2188',
    accentFocus: '#401362',
    safe: { fg: '#0A5E36', bg: '#EDFAF1', border: '#ABE5C2' },
    caution: { fg: '#6A4400', bg: '#FEF9ED', border: '#FDE1AB' },
    warning: { fg: '#843400', bg: '#FFF5EB', border: '#FDC395' },
    panic: { fg: '#910A3E', bg: '#FDF2F7', border: '#FAB7D2' },
    syntax: {
      keyword: '#5B2188',
      string: '#843400',
      function: '#362465',
      type: '#0A5E36',
      constant: '#6A4400',
      number: '#910A3E',
      variable: '#1A0E26',
      parameter: '#6A4400',
      comment: '#5A486F',
      tag: '#5B2188',
      attribute: '#362465',
      property: '#1A0E26',
      operator: '#1A0E26',
      regex: '#910A3E',
      uuid: '#910A3E',
      secret: '#910A3E'
    }
  },
  {
    id: 'zerotosaas-yellow',
    name: 'ZeroToSaaS Golden Sand (Yellow)',
    type: 'light',
    // Distinct Solar Ochre & Dijon Gold
    bg: '#FCFAF4',
    bgSubtle: '#F6F2E3',
    bgSidebar: '#F2EDDC',
    bgActivityBar: '#EAE3CE',
    bgStatusBar: '#6E4E00',
    fgStatusBar: '#FFFFFF',
    bgActive: '#DDD2B6',
    bgSelection: '#E8DC9EB3',
    border: '#CEBF8F',
    borderStrong: '#A8955A',
    fg: '#221B03',
    fgMuted: '#605426',
    accent: '#6B4C00',
    accentFocus: '#4E3700',
    safe: { fg: '#1C6026', bg: '#F1FAF3', border: '#B4E6C1' },
    caution: { fg: '#6A4D00', bg: '#FEFAEB', border: '#FDE496' },
    warning: { fg: '#734400', bg: '#FFF6E8', border: '#FDCB8E' },
    panic: { fg: '#8E1200', bg: '#FEF1EE', border: '#FBBCB0' },
    syntax: {
      keyword: '#6E4E00',
      string: '#684B00',
      function: '#5C4100',
      type: '#2C5814',
      constant: '#684B00',
      number: '#8E1200',
      variable: '#221B03',
      parameter: '#6E4E00',
      comment: '#5D522B',
      tag: '#6E4E00',
      attribute: '#5C4100',
      property: '#221B03',
      operator: '#221B03',
      regex: '#8E1200',
      uuid: '#8E1200',
      secret: '#8E1200'
    }
  },
  {
    id: 'zerotosaas-orange',
    name: 'ZeroToSaaS Terracotta (Orange)',
    type: 'light',
    // Distinct Crisp Burnt Orange & Fiery Terracotta
    bg: '#FCF8F4',
    bgSubtle: '#F6ECE4',
    bgSidebar: '#F3E7DC',
    bgActivityBar: '#EBE0D3',
    bgStatusBar: '#943800',
    fgStatusBar: '#FFFFFF',
    bgActive: '#DECBB9',
    bgSelection: '#ECC6A5B3',
    border: '#D0B296',
    borderStrong: '#AB825E',
    fg: '#261206',
    fgMuted: '#6A4633',
    accent: '#8F3500',
    accentFocus: '#6E2800',
    safe: { fg: '#16612E', bg: '#F2FAF4', border: '#B3E6C3' },
    caution: { fg: '#733E00', bg: '#FEF7EC', border: '#FDDDA2' },
    warning: { fg: '#8F3600', bg: '#FFF4EB', border: '#FDBF92' },
    panic: { fg: '#961103', bg: '#FEF1EF', border: '#FBBCB3' },
    syntax: {
      keyword: '#913600',
      string: '#8C3800',
      function: '#7A2B06',
      type: '#16612E',
      constant: '#853700',
      number: '#961103',
      variable: '#261206',
      parameter: '#7D3800',
      comment: '#674534',
      tag: '#913600',
      attribute: '#7A2B06',
      property: '#261206',
      operator: '#261206',
      regex: '#961103',
      uuid: '#961103',
      secret: '#961103'
    }
  }
];

// =============================================================================
// NIGHT (DARK) THEME PALETTES
// =============================================================================
// Polarity inversion of the 10 light palettes. Hue and chroma are preserved;
// only OkLCH lightness is flipped. The 5 medically constrained themes
// (Light, High Contrast, Deuteranopia, Protanopia, Tritanopia) receive
// hand-tuned overrides after programmatic derivation; the 5 ambient themes
// (Brown, Green, Purple, Yellow, Orange) use the programmatic output directly.
// All palettes must pass scripts/validate-contrast.js at WCAG AAA (>= 7:1).

function toNightName(lightName) {
  const idx = lightName.indexOf(' (');
  if (idx === -1) return lightName + ' Night';
  return lightName.slice(0, idx) + ' Night' + lightName.slice(idx);
}

// Derive a dark palette from a light palette by inverting OkLCH lightness.
// Preserves hue and chroma for CVD-safe wavelength discrimination.
function deriveDarkFromLight(light, overrides = {}) {
  const canvas = deriveDarkCanvasStack(light.bg, 0.16);
  const isHcLight = light.type === 'hc-light';

  const syntax = {};
  for (const [k, v] of Object.entries(light.syntax)) {
    // variable/property/operator are structural — render near-foreground luminance
    const isHighLum = k === 'variable' || k === 'property' || k === 'operator';
    const targetL = isHighLum ? 0.92 : 0.72;
    syntax[k] = invertLightness(v, targetL, { maxChroma: 0.18 });
  }

  const dark = {
    id: light.id + '-night',
    name: toNightName(light.name),
    type: isHcLight ? 'hc-dark' : 'dark',
    bg: canvas.bg,
    bgSubtle: canvas.bgSubtle,
    bgSidebar: canvas.bgSidebar,
    bgActivityBar: canvas.bgActivityBar,
    bgStatusBar: invertLightness(light.bgStatusBar, 0.28, { maxChroma: 0.15 }),
    fgStatusBar: '#FFFFFF',
    bgActive: invertLightness(light.bg, 0.24, { maxChroma: 0.012 }),
    bgSelection: invertLightness(light.accent, 0.30, { maxChroma: 0.15 }) + 'B3',
    border: invertLightness(light.bg, 0.30, { maxChroma: 0.012 }),
    borderStrong: invertLightness(light.bg, 0.38, { maxChroma: 0.012 }),
    fg: invertLightness(light.fg, 0.93, { maxChroma: 0.015 }),
    fgMuted: invertLightness(light.fgMuted, 0.68, { maxChroma: 0.02 }),
    accent: invertLightness(light.accent, 0.72, { maxChroma: 0.18 }),
    accentFocus: invertLightness(light.accentFocus, 0.78, { maxChroma: 0.18 }),
    safe: {
      fg: invertLightness(light.safe.fg, 0.75, { maxChroma: 0.16 }),
      bg: invertLightness(light.safe.bg, 0.20, { maxChroma: 0.04 }),
      border: invertLightness(light.safe.fg, 0.75, { maxChroma: 0.16 })
    },
    caution: {
      fg: invertLightness(light.caution.fg, 0.78, { maxChroma: 0.16 }),
      bg: invertLightness(light.caution.bg, 0.22, { maxChroma: 0.04 }),
      border: invertLightness(light.caution.fg, 0.78, { maxChroma: 0.16 })
    },
    warning: {
      fg: invertLightness(light.warning.fg, 0.75, { maxChroma: 0.16 }),
      bg: invertLightness(light.warning.bg, 0.20, { maxChroma: 0.04 }),
      border: invertLightness(light.warning.fg, 0.75, { maxChroma: 0.16 })
    },
    panic: {
      fg: invertLightness(light.panic.fg, 0.72, { maxChroma: 0.18 }),
      bg: invertLightness(light.panic.bg, 0.20, { maxChroma: 0.04 }),
      border: invertLightness(light.panic.fg, 0.72, { maxChroma: 0.18 })
    },
    syntax
  };

  return { ...dark, ...overrides };
}

// Hand-tuned overrides for the 5 medically constrained themes.
// These fine-tune the programmatic derivation to preserve CVD confusion axes
// and ISO 9241-303 high-contrast requirements on dark canvases.
const handTunedOverrides = {
  'zerotosaas-light': {
    bg: '#0C1119',
    bgSubtle: '#121822',
    bgSidebar: '#171D27',
    bgActivityBar: '#1D232E',
    bgStatusBar: '#0B4F9C',
    bgActive: '#1E2530',
    bgSelection: '#2A4A7AB3',
    border: '#2B323D',
    borderStrong: '#3D4651',
    fg: '#E8ECF1',
    fgMuted: '#95A0B0',
    accent: '#5B9BD6',
    accentFocus: '#7AB5E8',
    safe: { fg: '#6BCB7A', bg: '#0E2A14', border: '#6BCB7A' },
    caution: { fg: '#E8B85A', bg: '#2A2410', border: '#E8B85A' },
    warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
    panic: { fg: '#F0657A', bg: '#2A0E12', border: '#F0657A' },
    syntax: {
      keyword: '#5B9BD6',
      string: '#E89A5A',
      function: '#B89BE8',
      type: '#6BCB7A',
      constant: '#E8B85A',
      number: '#F0657A',
      variable: '#E8ECF1',
      parameter: '#E8B85A',
      comment: '#95A0B0',
      tag: '#5B9BD6',
      attribute: '#B89BE8',
      property: '#E8ECF1',
      operator: '#E8ECF1',
      regex: '#F0657A',
      uuid: '#F0657A',
      secret: '#F0657A'
    }
  },
  'zerotosaas-high-contrast': {
    bg: '#000000',
    bgSubtle: '#0A0A0A',
    bgSidebar: '#0F0F0F',
    bgActivityBar: '#141414',
    bgStatusBar: '#FFFFFF',
    fgStatusBar: '#000000',
    bgActive: '#1E1E1E',
    bgSelection: '#1A3A6AE6',
    border: '#FFFFFF',
    borderStrong: '#FFFFFF',
    fg: '#FFFFFF',
    fgMuted: '#B0B0B0',
    accent: '#5B9BD6',
    accentFocus: '#7AB5E8',
    safe: { fg: '#6BCB7A', bg: '#0E2A14', border: '#FFFFFF' },
    caution: { fg: '#E8B85A', bg: '#2A2410', border: '#FFFFFF' },
    warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#FFFFFF' },
    panic: { fg: '#F0657A', bg: '#2A0E12', border: '#FFFFFF' },
    syntax: {
      keyword: '#5B9BD6',
      string: '#E89A5A',
      function: '#B89BE8',
      type: '#6BCB7A',
      constant: '#E8B85A',
      number: '#F0657A',
      variable: '#FFFFFF',
      parameter: '#E8B85A',
      comment: '#B0B0B0',
      tag: '#5B9BD6',
      attribute: '#B89BE8',
      property: '#FFFFFF',
      operator: '#FFFFFF',
      regex: '#F0657A',
      uuid: '#F0657A',
      secret: '#F0657A'
    }
  },
  'zerotosaas-deuteranopia': {
    bg: '#0A141C',
    bgSubtle: '#131C25',
    bgSidebar: '#18222B',
    bgActivityBar: '#1E2831',
    bgStatusBar: '#0043A4',
    bgActive: '#1E2D3A',
    bgSelection: '#1A3A6AB3',
    border: '#2D3841',
    borderStrong: '#414C56',
    fg: '#E8EEF4',
    fgMuted: '#90A0B8',
    accent: '#4A9AE6',
    accentFocus: '#6BB4F0',
    safe: { fg: '#4A9AE6', bg: '#0E1A2A', border: '#4A9AE6' },
    caution: { fg: '#E8A05A', bg: '#2A1E10', border: '#E8A05A' },
    warning: { fg: '#E88A4A', bg: '#2A180E', border: '#E88A4A' },
    panic: { fg: '#E8704A', bg: '#2A120E', border: '#E8704A' },
    syntax: {
      keyword: '#4A9AE6',
      string: '#E88A4A',
      function: '#7A9AE8',
      type: '#4A9AE6',
      constant: '#E8A05A',
      number: '#E8704A',
      variable: '#E8EEF4',
      parameter: '#E8A05A',
      comment: '#90A0B8',
      tag: '#4A9AE6',
      attribute: '#7A9AE8',
      property: '#E8EEF4',
      operator: '#E8EEF4',
      regex: '#E8704A',
      uuid: '#E8704A',
      secret: '#E8704A'
    }
  },
  'zerotosaas-protanopia': {
    bg: '#110D14',
    bgSubtle: '#19131E',
    bgSidebar: '#1D1823',
    bgActivityBar: '#231D28',
    bgStatusBar: '#8C0064',
    bgActive: '#241E2E',
    bgSelection: '#4A2858B3',
    border: '#2D2833',
    borderStrong: '#3C3642',
    fg: '#EEEAF0',
    fgMuted: '#A092AC',
    accent: '#5B9BD6',
    accentFocus: '#7AB5E8',
    safe: { fg: '#4AD0BC', bg: '#0E2622', border: '#4AD0BC' },
    caution: { fg: '#E8B85A', bg: '#2A2410', border: '#E8B85A' },
    warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
    panic: { fg: '#E870B0', bg: '#2A0E1E', border: '#E870B0' },
    syntax: {
      keyword: '#5B9BD6',
      string: '#E89A5A',
      function: '#E870B0',
      type: '#4AD0BC',
      constant: '#E8B85A',
      number: '#E870B0',
      variable: '#EEEAF0',
      parameter: '#E8B85A',
      comment: '#A092AC',
      tag: '#5B9BD6',
      attribute: '#E870B0',
      property: '#EEEAF0',
      operator: '#EEEAF0',
      regex: '#E870B0',
      uuid: '#E870B0',
      secret: '#E870B0'
    }
  },
  'zerotosaas-tritanopia': {
    bg: '#0A1317',
    bgSubtle: '#111A21',
    bgSidebar: '#142027',
    bgActivityBar: '#19262D',
    bgStatusBar: '#A00028',
    bgActive: '#1E2830',
    bgSelection: '#3A1E28B3',
    border: '#26353B',
    borderStrong: '#3A4850',
    fg: '#E8F0F2',
    fgMuted: '#90A4AC',
    accent: '#E86080',
    accentFocus: '#F080A0',
    safe: { fg: '#4AD0E0', bg: '#0E2226', border: '#4AD0E0' },
    caution: { fg: '#E8D05A', bg: '#2A2610', border: '#E8D05A' },
    warning: { fg: '#E87060', bg: '#2A1210', border: '#E87060' },
    panic: { fg: '#E86080', bg: '#2A0E16', border: '#E86080' },
    syntax: {
      keyword: '#E86080',
      string: '#E87060',
      function: '#E84070',
      type: '#4AD0E0',
      constant: '#E8D05A',
      number: '#E86080',
      variable: '#E8F0F2',
      parameter: '#E8D05A',
      comment: '#90A4AC',
      tag: '#E86080',
      attribute: '#E84070',
      property: '#E8F0F2',
      operator: '#E8F0F2',
      regex: '#E86080',
      uuid: '#E86080',
      secret: '#E86080'
    }
  }
};

// Lighten a color in OkLCH space until it reaches the target contrast ratio
// against the given background. Preserves hue and chroma.
function tuneForContrast(fg, bg, targetRatio = 7.0) {
  let ratio = contrastRatio(fg, bg);
  if (ratio >= targetRatio) return fg;
  const ok = hexToOklch(fg);
  let L = ok.L;
  while (ratio < targetRatio && L < 0.99) {
    L += 0.005;
    const candidate = oklchToHex(L, ok.C, ok.h);
    ratio = contrastRatio(candidate, bg);
  }
  return oklchToHex(Math.min(L, 0.99), ok.C, ok.h);
}

// Post-process a dark palette to guarantee WCAG AAA (>= 7:1) on every token.
// Each syntax color is tuned against the editor canvas. Each cognitive-status
// fg is tuned against both the editor canvas and its own cognitive-status bg
// (the stricter of the two wins). fgMuted is tuned against the canvas.
function tuneDarkPalette(dark) {
  const tuned = { ...dark };
  const bg = dark.bg;

  // Tune foreground and muted foreground
  tuned.fg = tuneForContrast(dark.fg, bg);
  tuned.fgMuted = tuneForContrast(dark.fgMuted, bg);

  // Tune accent colors
  tuned.accent = tuneForContrast(dark.accent, bg);
  tuned.accentFocus = tuneForContrast(dark.accentFocus, bg);

  // Tune syntax tokens against editor canvas
  tuned.syntax = {};
  for (const [k, v] of Object.entries(dark.syntax)) {
    tuned.syntax[k] = tuneForContrast(v, bg);
  }

  // Tune cognitive status: fg must pass against both editor bg and status bg
  for (const status of ['safe', 'caution', 'warning', 'panic']) {
    const s = dark[status];
    const vsCanvas = tuneForContrast(s.fg, bg);
    const vsStatusBg = tuneForContrast(vsCanvas, s.bg);
    tuned[status] = {
      fg: vsStatusBg,
      bg: s.bg,
      border: vsStatusBg
    };
  }

  return tuned;
}

// Build the 10 Night palettes: programmatic derivation for all, then
// apply hand-tuned overrides to the 5 medically constrained themes,
// then auto-tune every palette to guarantee WCAG AAA compliance.
const darkThemeDefinitions = themeDefinitions.map(light => {
  const overrides = handTunedOverrides[light.id] || {};
  const derived = deriveDarkFromLight(light, overrides);
  return tuneDarkPalette(derived);
});

function buildThemeJson(theme) {
  const isHc = theme.type === 'hc-light' || theme.type === 'hc-dark';
  const isDark = theme.type === 'dark' || theme.type === 'hc-dark';

  const colors = {
    // Base Colors & Focus
    'focusBorder': theme.accent,
    'foreground': theme.fg,
    'disabledForeground': theme.fgMuted + 'AA',
    'widget.shadow': isDark ? '#00000066' : '#00000018',
    'selection.background': theme.bgActive,
    'descriptionForeground': theme.fgMuted,
    'errorForeground': theme.panic.fg,
    'icon.foreground': theme.fg,

    // Window / Title Bar
    'titleBar.activeBackground': theme.bgSidebar,
    'titleBar.activeForeground': theme.fg,
    'titleBar.inactiveBackground': theme.bgSubtle,
    'titleBar.inactiveForeground': theme.fgMuted,
    'titleBar.border': theme.border,

    // Activity Bar (Reflecting Theme's Core Identity)
    'activityBar.background': theme.bgActivityBar,
    'activityBar.foreground': theme.accent,
    'activityBar.inactiveForeground': theme.fgMuted,
    'activityBar.border': theme.border,
    'activityBar.activeBorder': theme.accent,
    'activityBarBadge.background': theme.accent,
    'activityBarBadge.foreground': '#FFFFFF',

    // Sidebar
    'sideBar.background': theme.bgSidebar,
    'sideBar.foreground': theme.fg,
    'sideBar.border': theme.border,
    'sideBarTitle.foreground': theme.accent,
    'sideBarSectionHeader.background': theme.bgSubtle,
    'sideBarSectionHeader.foreground': theme.fg,
    'sideBarSectionHeader.border': theme.border,

    // Editor & Canvas
    'editor.background': theme.bg,
    'editor.foreground': theme.fg,
    'editorLineNumber.foreground': theme.fgMuted + '99',
    'editorLineNumber.activeForeground': theme.accent,
    'editorCursor.foreground': theme.accent,
    'editor.selectionBackground': theme.bgSelection || (theme.accent + '33'),
    'editor.selectionHighlightBackground': theme.bgSelection ? (theme.bgSelection.substring(0, 7) + '66') : (theme.accent + '1A'),
    'editor.inactiveSelectionBackground': theme.bgSelection ? (theme.bgSelection.substring(0, 7) + '80') : (theme.accent + '20'),
    'editor.selectionHighlightBorder': theme.accent + '4D',
    'editor.wordHighlightBackground': theme.accent + '1A',
    'editor.wordHighlightStrongBackground': theme.accent + '2E',
    'editor.findMatchBackground': theme.caution.bg,
    'editor.findMatchHighlightBackground': theme.caution.bg + 'CC',
    'editor.findMatchBorder': theme.caution.border,
    'editor.hoverHighlightBackground': theme.bgSubtle,
    'editor.lineHighlightBackground': theme.bgSubtle + '77',
    'editor.lineHighlightBorder': isHc ? theme.border : '#00000000',
    'editorLink.activeForeground': theme.accent,

    // Editor Tabs & Groups
    'editorGroup.border': theme.border,
    'editorGroupHeader.tabsBackground': theme.bgSubtle,
    'editorGroupHeader.noTabsBackground': theme.bg,
    'editorGroupHeader.tabsBorder': theme.border,
    'tab.activeBackground': theme.bg,
    'tab.activeForeground': theme.fg,
    'tab.activeBorderTop': theme.accent,
    'tab.activeBorder': isHc ? theme.border : theme.accent,
    'tab.inactiveBackground': theme.bgSubtle,
    'tab.inactiveForeground': theme.fgMuted,
    'tab.border': theme.border,
    'tab.hoverBackground': theme.bg,
    'tab.hoverForeground': theme.fg,
    'tab.unfocusedActiveBackground': theme.bg,
    'tab.unfocusedActiveForeground': theme.fg,
    'tab.unfocusedInactiveForeground': theme.fgMuted,

    // Breadcrumbs
    'breadcrumb.foreground': theme.fgMuted,
    'breadcrumb.focusForeground': theme.fg,
    'breadcrumb.activeSelectionForeground': theme.accent,
    'breadcrumb.background': theme.bg,

    // Status Bar (Prominently Expressing Theme Identity)
    'statusBar.background': theme.bgStatusBar,
    'statusBar.foreground': theme.fgStatusBar,
    'statusBar.border': isHc ? theme.border : theme.bgStatusBar,
    'statusBar.debuggingBackground': theme.warning.bg,
    'statusBar.debuggingForeground': theme.warning.fg,
    'statusBar.noFolderBackground': theme.bgStatusBar,
    'statusBar.noFolderForeground': theme.fgStatusBar,
    'statusBarItem.hoverBackground': '#FFFFFF25',
    'statusBarItem.remoteBackground': '#00000030',
    'statusBarItem.remoteForeground': '#FFFFFF',

    // Lists & Trees (File Explorer, Quick Pick, Outline)
    'list.activeSelectionBackground': theme.bgActive,
    'list.activeSelectionForeground': theme.fg,
    'list.activeSelectionIconForeground': theme.accent,
    'list.inactiveSelectionBackground': theme.bgSelection ? (theme.bgSelection.substring(0, 7) + '77') : (theme.bgActive + '99'),
    'list.inactiveSelectionForeground': theme.fg,
    'list.inactiveSelectionIconForeground': theme.accent,
    'list.inactiveFocusBackground': theme.bgSelection ? (theme.bgSelection.substring(0, 7) + '55') : (theme.bgActive + '66'),
    'list.hoverBackground': theme.bgActive + '66',
    'list.hoverForeground': theme.fg,
    'list.focusBackground': theme.bgActive,
    'list.focusForeground': theme.fg,
    'list.focusHighlightForeground': theme.accent,
    'list.highlightForeground': theme.accent,
    'list.errorForeground': theme.panic.fg,
    'list.warningForeground': theme.warning.fg,

    // Inputs & Dropdowns
    'input.background': theme.bg,
    'input.foreground': theme.fg,
    'input.border': theme.borderStrong,
    'input.placeholderForeground': theme.fgMuted,
    'inputOption.activeBorder': theme.accent,
    'inputValidation.errorBackground': theme.panic.bg,
    'inputValidation.errorBorder': theme.panic.fg,
    'inputValidation.warningBackground': theme.warning.bg,
    'inputValidation.warningBorder': theme.warning.fg,
    'inputValidation.infoBackground': theme.safe.bg,
    'inputValidation.infoBorder': theme.safe.fg,
    'dropdown.background': theme.bg,
    'dropdown.foreground': theme.fg,
    'dropdown.border': theme.borderStrong,

    // Buttons & Badges
    'button.background': theme.accent,
    'button.foreground': '#FFFFFF',
    'button.hoverBackground': theme.accentFocus,
    'button.secondaryBackground': theme.bgSubtle,
    'button.secondaryForeground': theme.fg,
    'button.secondaryHoverBackground': theme.bgActive,
    'badge.background': theme.accent,
    'badge.foreground': '#FFFFFF',

    // Terminal (Fully Theme-Calibrated & WCAG AAA Accessible)
    'terminal.background': theme.bg,
    'terminal.foreground': theme.fg,
    'terminal.border': theme.border,
    'terminalCursor.foreground': theme.accent,
    'terminalCursor.background': theme.bg,
    'terminal.selectionBackground': theme.bgSelection || (theme.accent + '33'),
    'terminal.inactiveSelectionBackground': theme.bgSelection ? (theme.bgSelection.substring(0, 7) + '55') : (theme.accent + '20'),
    'terminal.findMatchBackground': theme.caution.bg,
    'terminal.findMatchBorder': theme.caution.border,
    'terminal.findMatchHighlightBackground': theme.caution.bg + 'CC',
    'terminal.hoverHighlightBackground': theme.bgSubtle,
    'terminalOverviewRuler.cursorForeground': theme.accent,
    'terminalOverviewRuler.findMatchForeground': theme.caution.fg,
    'terminalCommandDecoration.defaultBackground': theme.accent + '80',
    'terminalCommandDecoration.successBackground': theme.safe.fg,
    'terminalCommandDecoration.errorBackground': theme.panic.fg,
    'terminal.tab.activeBorder': theme.accent,
    // On dark themes, ANSI black/white semantics invert: black = darkest,
    // white = lightest. On light themes, black = foreground, white = bgSubtle.
    'terminal.ansiBlack': isDark ? theme.bgSubtle : theme.fg,
    'terminal.ansiRed': theme.panic.fg,
    'terminal.ansiGreen': theme.safe.fg,
    'terminal.ansiYellow': theme.caution.fg,
    'terminal.ansiBlue': theme.accent,
    'terminal.ansiMagenta': theme.syntax.function,
    'terminal.ansiCyan': theme.syntax.type,
    'terminal.ansiWhite': isDark ? theme.fg : theme.bgSubtle,
    'terminal.ansiBrightBlack': isDark ? theme.bgSidebar : theme.fgMuted,
    'terminal.ansiBrightRed': theme.panic.fg,
    'terminal.ansiBrightGreen': theme.safe.fg,
    'terminal.ansiBrightYellow': theme.caution.fg,
    'terminal.ansiBrightBlue': theme.accentFocus,
    'terminal.ansiBrightMagenta': theme.syntax.function,
    'terminal.ansiBrightCyan': theme.syntax.type,
    'terminal.ansiBrightWhite': isDark ? '#FFFFFF' : theme.fg,

    // Debug Console & Runtime Expression Evaluation
    'debugConsole.background': theme.bg,
    'debugConsole.foreground': theme.fg,
    'debugConsole.errorForeground': theme.panic.fg,
    'debugConsole.warningForeground': theme.warning.fg,
    'debugConsole.infoForeground': theme.safe.fg,
    'debugConsole.sourceForeground': theme.fgMuted,
    'debugConsoleInputIcon.foreground': theme.accent,
    'debugTokenExpression.name': theme.syntax.property || theme.fg,
    'debugTokenExpression.value': theme.syntax.string || theme.accent,
    'debugTokenExpression.string': theme.syntax.string,
    'debugTokenExpression.boolean': theme.syntax.constant,
    'debugTokenExpression.number': theme.syntax.number,
    'debugTokenExpression.error': theme.panic.fg,
    'debugView.stateLabelForeground': theme.accent,
    'debugView.valueChangedHighlight': theme.caution.bg,

    // Debug ToolBar & Execution Controls
    'debugToolBar.background': theme.bgSubtle,
    'debugToolBar.border': theme.border,
    'debugIcon.breakpointForeground': theme.panic.fg,
    'debugIcon.breakpointDisabledForeground': theme.fgMuted + '80',
    'debugIcon.breakpointUnverifiedForeground': theme.warning.fg,
    'debugIcon.breakpointCurrentStackframeForeground': theme.caution.fg,
    'debugIcon.breakpointStackframeForeground': theme.safe.fg,
    'debugIcon.startForeground': theme.safe.fg,
    'debugIcon.pauseForeground': theme.caution.fg,
    'debugIcon.stopForeground': theme.panic.fg,
    'debugIcon.disconnectForeground': theme.panic.fg,
    'debugIcon.restartForeground': theme.safe.fg,
    'debugIcon.stepOverForeground': theme.accent,
    'debugIcon.stepIntoForeground': theme.accent,
    'debugIcon.stepOutForeground': theme.accent,
    'debugIcon.continueForeground': theme.safe.fg,
    'debugIcon.stepBackForeground': theme.accent,

    // Output & Log View
    'outputView.background': theme.bg,
    'outputViewStickyScroll.background': theme.bgSubtle,

    // Problems & Diagnostics Panel
    'problemsErrorIcon.foreground': theme.panic.fg,
    'problemsWarningIcon.foreground': theme.warning.fg,
    'problemsInfoIcon.foreground': theme.accent,

    // Search Editor & Integrated Project Search
    'searchEditor.findMatchBackground': theme.caution.bg,
    'searchEditor.findMatchBorder': theme.caution.border,

    // Editor Widgets (Suggest, Parameter Hints, Hover, Find)
    'editorWidget.background': theme.bg,
    'editorWidget.foreground': theme.fg,
    'editorWidget.border': theme.borderStrong,
    'editorWidget.resizeBorder': theme.accent,
    'editorSuggestWidget.background': theme.bg,
    'editorSuggestWidget.border': theme.borderStrong,
    'editorSuggestWidget.foreground': theme.fg,
    'editorSuggestWidget.focusHighlightForeground': theme.accent,
    'editorSuggestWidget.highlightForeground': theme.accent,
    'editorSuggestWidget.selectedBackground': theme.bgActive,
    'editorSuggestWidget.selectedForeground': theme.fg,
    'editorSuggestWidget.selectedIconForeground': theme.accent,
    'editorHoverWidget.background': theme.bg,
    'editorHoverWidget.foreground': theme.fg,
    'editorHoverWidget.border': theme.borderStrong,
    'editorHoverWidget.statusBarBackground': theme.bgSubtle,

    // Context Menus & Dropdown Lists
    'menu.background': theme.bg,
    'menu.foreground': theme.fg,
    'menu.selectionBackground': theme.bgActive,
    'menu.selectionForeground': theme.fg,
    'menu.selectionBorder': isHc ? theme.border : theme.accent,
    'menu.separatorBackground': theme.border,
    'menu.border': theme.borderStrong,
    'menubar.selectionBackground': theme.bgActive,
    'menubar.selectionForeground': theme.fg,

    // Git & Diff
    'gitDecoration.addedResourceForeground': theme.safe.fg,
    'gitDecoration.modifiedResourceForeground': theme.caution.fg,
    'gitDecoration.deletedResourceForeground': theme.panic.fg,
    'gitDecoration.untrackedResourceForeground': theme.safe.fg,
    'gitDecoration.ignoredResourceForeground': theme.fgMuted + '88',
    'gitDecoration.conflictingResourceForeground': theme.warning.fg,
    'diffEditor.insertedTextBackground': theme.safe.bg + 'CC',
    'diffEditor.removedTextBackground': theme.panic.bg + 'CC',
    'diffEditor.border': theme.border,

    // Peek View & Popups
    'peekView.border': theme.accent,
    'peekViewEditor.background': theme.bgSubtle,
    'peekViewEditor.matchHighlightBackground': theme.caution.bg,
    'peekViewResult.background': theme.bgSidebar,
    'peekViewResult.matchHighlightBackground': theme.caution.bg,
    'peekViewResult.selectionBackground': theme.bgActive,
    'peekViewTitle.background': theme.bgSubtle,

    // Quick Input / Command Palette
    'quickInput.background': theme.bg,
    'quickInput.foreground': theme.fg,
    'quickInputList.focusBackground': theme.bgActive,

    // Notifications
    'notificationCenter.border': theme.borderStrong,
    'notificationToast.border': theme.borderStrong,
    'notifications.background': theme.bg,
    'notifications.foreground': theme.fg,
    'notifications.border': theme.border,

    // Diagnostics Squiggles
    'editorError.foreground': theme.panic.fg,
    'editorWarning.foreground': theme.warning.fg,
    'editorInfo.foreground': theme.accent,
    'editorHint.foreground': theme.safe.fg,

    // Bracket Matching & Pair Colorization (WCAG AAA)
    'editorBracketMatch.background': theme.bgActive,
    'editorBracketMatch.border': theme.accent,
    'editorBracketHighlight.foreground1': theme.accent,
    'editorBracketHighlight.foreground2': theme.safe.fg,
    'editorBracketHighlight.foreground3': theme.caution.fg,
    'editorBracketHighlight.foreground4': theme.syntax.function,
    'editorBracketHighlight.foreground5': theme.syntax.type,
    'editorBracketHighlight.foreground6': theme.warning.fg,

    // Multi-Level Alternating Indent Guides (Levels 1-6)
    'editorIndentGuide.background': theme.border,
    'editorIndentGuide.activeBackground': theme.accent,
    'editorIndentGuide.background1': theme.accent + '25',
    'editorIndentGuide.background2': theme.safe.fg + '25',
    'editorIndentGuide.background3': theme.caution.fg + '25',
    'editorIndentGuide.background4': theme.syntax.function + '25',
    'editorIndentGuide.background5': theme.syntax.type + '25',
    'editorIndentGuide.background6': theme.warning.fg + '25',
    'editorIndentGuide.activeBackground1': theme.accent,
    'editorIndentGuide.activeBackground2': theme.safe.fg,
    'editorIndentGuide.activeBackground3': theme.caution.fg,
    'editorIndentGuide.activeBackground4': theme.syntax.function,
    'editorIndentGuide.activeBackground5': theme.syntax.type,
    'editorIndentGuide.activeBackground6': theme.warning.fg,

    // =========================================================================
    // ANTIGRAVITY IDE & WINDSURF / CASCADE AI ASSISTANT TOKENS
    // =========================================================================
    // AI Chat & Cascade Panels
    'chat.requestBackground': theme.bgSubtle,
    'chat.requestBorder': theme.border,
    'chat.avatarBackground': theme.accent,
    'chat.avatarForeground': '#FFFFFF',
    'chat.slashCommandBackground': theme.accent + '1A',
    'chat.slashCommandForeground': theme.accent,
    'chat.linesAddedForeground': theme.safe.fg,
    'chat.linesRemovedForeground': theme.panic.fg,
    'interactive.activeCodeBorder': theme.accent,
    'interactive.inactiveCodeBorder': theme.border,
    'interactive.requestBorder': theme.border,

    // Inline AI Assistant (Ctrl+K / Cmd+K Inline Chat & Multi-line Generation)
    'inlineChat.background': theme.bg,
    'inlineChat.border': theme.borderStrong,
    'inlineChat.shadow': isDark ? '#00000055' : '#00000022',
    'inlineChat.regionHighlight': theme.accent + '1A',
    'inlineChatInput.background': theme.bgSubtle,
    'inlineChatInput.border': theme.border,
    'inlineChatInput.focusBorder': theme.accent,
    'inlineChatInput.placeholderForeground': theme.fgMuted,
    'inlineChatDiff.inserted': theme.safe.bg + 'CC',
    'inlineChatDiff.removed': theme.panic.bg + 'CC',

    // Supercomplete, Ghost Text & AI Predictions (Windsurf Cascade & Antigravity Autocomplete)
    'editorGhostText.foreground': theme.fgMuted + 'CC',
    'editorGhostText.background': '#00000000',
    'editorGhostText.border': '#00000000',
    'editorAI.foreground': theme.accent,
    'editorAI.background': theme.accent + '15',
    'editorAI.border': theme.accent + '4D',
    'inlineEdit.indicator.background': theme.accent,
    'inlineEdit.indicator.foreground': '#FFFFFF',
    'inlineEdit.indicator.border': theme.accentFocus,
    'inlineEdit.modifiedBackground': theme.safe.bg + '80',
    'inlineEdit.originalBackground': theme.panic.bg + '80',
    'inlineEdit.border': theme.borderStrong,

    // Multi-File Agent Diff Editor (Antigravity & Windsurf Multi-File Review)
    'multiDiffEditor.background': theme.bg,
    'multiDiffEditor.border': theme.border,
    'multiDiffEditor.headerBackground': theme.bgSubtle,

    // Panels, Bottom Drawer & Section Headers (Agent Output, Terminal, Artifacts View)
    'panel.background': theme.bgSidebar,
    'panel.border': theme.border,
    'panelTitle.activeBorder': theme.accent,
    'panelTitle.activeForeground': theme.fg,
    'panelTitle.inactiveForeground': theme.fgMuted,
    'panelSection.border': theme.border,
    'panelSection.dropBackground': theme.bgActive,
    'panelSectionHeader.background': theme.bgSubtle,
    'panelSectionHeader.foreground': theme.fg,
    'panelSectionHeader.border': theme.border,

    // Sticky Scroll (Class, Function & Agent Block Sticky Headers)
    'editorStickyScroll.background': theme.bgSubtle,
    'editorStickyScrollHover.background': theme.bgActive,
    'editorStickyScroll.shadow': isDark ? '#00000044' : '#00000014',
    'editorStickyScroll.border': theme.border,

    // Inlay Hints (Type & Parameter Annotations)
    'editorInlayHint.background': theme.bgActive + '99',
    'editorInlayHint.foreground': theme.fgMuted,
    'editorInlayHint.typeForeground': theme.syntax.type,
    'editorInlayHint.parameterForeground': theme.syntax.parameter,

    // Command Center & Top Navigation Bar (Antigravity IDE & Windsurf)
    'commandCenter.foreground': theme.fg,
    'commandCenter.activeForeground': theme.fg,
    'commandCenter.background': theme.bgSubtle,
    'commandCenter.activeBackground': theme.bgActive,
    'commandCenter.border': theme.border,
    'commandCenter.activeBorder': theme.accent,
    'commandCenter.inactiveForeground': theme.fgMuted,
    'commandCenter.inactiveBorder': theme.border,

    // Keybinding Badges & Action Lists
    'keybindingLabel.background': theme.bgSubtle,
    'keybindingLabel.foreground': theme.fg,
    'keybindingLabel.border': theme.borderStrong,
    'keybindingLabel.bottomBorder': theme.borderStrong,
    'editorActionList.background': theme.bg,
    'editorActionList.foreground': theme.fg,
    'editorActionList.focusBackground': theme.bgActive,
    'editorActionList.focusForeground': theme.fg,

    // Symbol Icons (Navigation, Quick Pick, Symbol Tree & AI Outline)
    'symbolIcon.classForeground': theme.syntax.type,
    'symbolIcon.interfaceForeground': theme.syntax.type,
    'symbolIcon.functionForeground': theme.syntax.function,
    'symbolIcon.methodForeground': theme.syntax.function,
    'symbolIcon.variableForeground': theme.syntax.variable,
    'symbolIcon.constantForeground': theme.syntax.constant,
    'symbolIcon.propertyForeground': theme.syntax.property,
    'symbolIcon.keywordForeground': theme.syntax.keyword,
    'symbolIcon.stringForeground': theme.syntax.string,
    'symbolIcon.numberForeground': theme.syntax.number,
    'symbolIcon.booleanForeground': theme.syntax.number,
    'symbolIcon.arrayForeground': theme.syntax.variable,
    'symbolIcon.objectForeground': theme.syntax.type,
    'symbolIcon.moduleForeground': theme.accent,
    'symbolIcon.packageForeground': theme.accent,
    'symbolIcon.structForeground': theme.syntax.type,
    'symbolIcon.typeParameterForeground': theme.syntax.type,
    'symbolIcon.unitForeground': theme.syntax.constant,
    'symbolIcon.keyForeground': theme.syntax.keyword,
    'symbolIcon.fieldForeground': theme.syntax.property,
    'symbolIcon.colorForeground': theme.syntax.number,
    'symbolIcon.fileForeground': theme.fg,
    'symbolIcon.folderForeground': theme.accent,
    'symbolIcon.eventForeground': theme.syntax.function,
    'symbolIcon.operatorForeground': theme.syntax.operator,
    'symbolIcon.nullForeground': theme.syntax.constant,
    'symbolIcon.snippetForeground': theme.accent,
    'symbolIcon.textForeground': theme.fg,

    // Settings, Welcome Page & Walkthroughs
    'settings.headerForeground': theme.accent,
    'settings.modifiedItemIndicator': theme.accent,
    'settings.focusedRowBackground': theme.bgActive + '50',
    'settings.rowHoverBackground': theme.bgActive + '25',
    'welcomePage.background': theme.bg,
    'welcomePage.buttonBackground': theme.bgSubtle,
    'welcomePage.buttonHoverBackground': theme.bgActive,
    'walkThrough.embeddedEditorBackground': theme.bgSubtle
  };

  // TextMate Token Rules with Contextual Scoping & Semantic Cognitive Status
  const tokenColors = [
    // -------------------------------------------------------------
    // BASE UNIVERSAL SYNTAX (WCAG AAA >= 7:1)
    // -------------------------------------------------------------
    {
      name: 'Comments & Documentation',
      scope: [
        'comment',
        'comment.line',
        'comment.line.double-slash',
        'comment.line.triple-slash',
        'comment.line.number-sign',
        'comment.line.dashes',
        'comment.line.character',
        'comment.line.percentage',
        'comment.block',
        'comment.block.documentation',
        'punctuation.definition.comment',
        'string.comment',
        'string.quoted.docstring',
        'string.quoted.docstring.multi',
        'string.quoted.docstring.multi.python',
        'string.quoted.docstring.single.python',
        'string.quoted.double.block.python',
        'string.quoted.single.block.python',
        'source.kotlin comment',
        'source.kotlin comment.line',
        'source.kotlin comment.block',
        'source.kotlin comment.block.documentation',
        'source.swift comment',
        'source.go comment',
        'source.rust comment',
        'source.dart comment',
        'source.java comment',
        'source.ts comment',
        'source.tsx comment',
        'source.js comment',
        'source.jsx comment',
        'source.python comment',
        'source.sql comment',
        'source.shell comment',
        'source.yaml comment'
      ],
      settings: {
        foreground: theme.syntax.comment,
        fontStyle: 'italic'
      }
    },
    {
      name: 'Keywords & Control Flow',
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'keyword.operator.delete',
        'storage',
        'storage.type',
        'storage.modifier'
      ],
      settings: {
        foreground: theme.syntax.keyword,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Functions & Methods',
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call',
        'variable.function'
      ],
      settings: {
        foreground: theme.syntax.function
      }
    },
    {
      name: 'Types, Classes, Structs & Interfaces',
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.struct',
        'entity.name.enum',
        'entity.name.interface',
        'support.class',
        'support.type',
        'entity.other.inherited-class'
      ],
      settings: {
        foreground: theme.syntax.type,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Constants & Language Built-ins',
      scope: [
        'constant',
        'constant.language',
        'constant.numeric',
        'support.constant'
      ],
      settings: {
        foreground: theme.syntax.constant
      }
    },
    {
      name: 'Variables & Identifiers',
      scope: [
        'variable',
        'variable.other',
        'variable.other.readwrite',
        'variable.other.property'
      ],
      settings: {
        foreground: theme.syntax.variable
      }
    },
    {
      name: 'Operators & Punctuation',
      scope: [
        'keyword.operator',
        'punctuation',
        'punctuation.accessor',
        'punctuation.separator'
      ],
      settings: {
        foreground: theme.syntax.operator
      }
    },

    // -------------------------------------------------------------
    // SEMANTIC STATUS: PANIC 🔴 (Keys, UUIDs, Hex, Regex, Deprecated)
    // -------------------------------------------------------------
    {
      name: 'Panic: Invalid, Illegal & Deprecated Code',
      scope: [
        'invalid',
        'invalid.illegal',
        'invalid.deprecated'
      ],
      settings: {
        foreground: theme.panic.fg,
        background: theme.panic.bg,
        fontStyle: 'bold underline'
      }
    },
    {
      name: 'Panic: Secret Keys, Hex Colors, UUIDs & Hashes',
      scope: [
        'constant.other.color',
        'constant.other.color.rgb-value',
        'constant.other.uuid',
        'support.constant.color',
        'keyword.other.dotenv',
        'source.env variable.other.key',
        'source.dotenv variable.other.key'
      ],
      settings: {
        foreground: theme.panic.fg,
        background: theme.panic.bg
      }
    },
    {
      name: 'Panic: Regular Expressions',
      scope: [
        'string.regexp',
        'string.regexp constant.character.escape',
        'constant.other.character-class.regexp'
      ],
      settings: {
        foreground: theme.panic.fg,
        background: theme.panic.bg
      }
    },

    // -------------------------------------------------------------
    // SEMANTIC STATUS: WARNING 🟠 (Hardcoded Strings & Magic Literals)
    // -------------------------------------------------------------
    {
      name: 'Warning: Hardcoded Strings in Source Code (Python, JS, TS, React, Rust, Go, Kotlin, Swift, Dart)',
      scope: [
        'source.python string.quoted',
        'source.js string.quoted',
        'source.jsx string.quoted',
        'source.ts string.quoted',
        'source.tsx string.quoted',
        'source.rust string.quoted',
        'source.go string.quoted',
        'source.kotlin string.quoted',
        'source.swift string.quoted',
        'source.dart string.quoted',
        'source.sql string.quoted'
      ],
      settings: {
        foreground: theme.warning.fg,
        background: theme.warning.bg
      }
    },
    {
      name: 'Warning: Template Literals & Unparsed Primitives',
      scope: [
        'source.js string.template',
        'source.ts string.template',
        'source.tsx string.template',
        'source.python string.interpolated'
      ],
      settings: {
        foreground: theme.warning.fg,
        background: theme.warning.bg
      }
    },

    // -------------------------------------------------------------
    // SEMANTIC STATUS: CAUTION 🟡 (Parameters & Dynamic Inputs)
    // -------------------------------------------------------------
    {
      name: 'Caution: Function Parameters & Dynamic Arguments',
      scope: [
        'source.python variable.parameter',
        'source.js variable.parameter',
        'source.jsx variable.parameter',
        'source.ts variable.parameter',
        'source.tsx variable.parameter',
        'source.rust variable.parameter',
        'source.go variable.parameter',
        'source.kotlin variable.parameter',
        'source.swift variable.parameter',
        'source.dart variable.parameter'
      ],
      settings: {
        foreground: theme.caution.fg,
        background: theme.caution.bg
      }
    },

    // -------------------------------------------------------------
    // SEMANTIC STATUS: SAFE 🟢 (Verified Types, Schemas & Interfaces)
    // -------------------------------------------------------------
    {
      name: 'Safe: Verified Type Definitions & Structs',
      scope: [
        'source.ts entity.name.type',
        'source.tsx entity.name.type',
        'source.rust entity.name.type',
        'source.go entity.name.type',
        'source.kotlin entity.name.type',
        'source.swift entity.name.type',
        'source.dart entity.name.type',
        'source.python entity.name.type.class'
      ],
      settings: {
        foreground: theme.safe.fg,
        background: theme.safe.bg,
        fontStyle: 'bold'
      }
    },

    // -------------------------------------------------------------
    // LANGUAGE-SPECIFIC SCOPES: PROGRAMMING LANGUAGES
    // -------------------------------------------------------------
    // Python
    {
      name: 'Python: Decorators & Self',
      scope: [
        'source.python entity.name.function.decorator',
        'source.python variable.language.special.self',
        'source.python variable.language.special.cls'
      ],
      settings: {
        foreground: theme.accentFocus,
        fontStyle: 'italic'
      }
    },
    {
      name: 'Python: Magic Methods & Dunder',
      scope: ['source.python support.function.magic'],
      settings: {
        foreground: theme.syntax.function,
        fontStyle: 'bold'
      }
    },

    // React / JSX / TSX
    {
      name: 'React: Component Tags (Safe / Green)',
      scope: [
        'source.jsx entity.name.tag',
        'source.tsx entity.name.tag',
        'source.jsx support.class.component',
        'source.tsx support.class.component'
      ],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'React: Props & Attributes (Caution / Yellow)',
      scope: [
        'source.jsx entity.other.attribute-name',
        'source.tsx entity.other.attribute-name'
      ],
      settings: {
        foreground: theme.caution.fg
      }
    },

    // SQL
    {
      name: 'SQL: Keywords (Safe / Blue)',
      scope: [
        'source.sql keyword.other.DML',
        'source.sql keyword.other.DDL',
        'source.sql keyword.other.order',
        'source.sql keyword.other.create'
      ],
      settings: {
        foreground: theme.syntax.keyword,
        fontStyle: 'bold'
      }
    },
    {
      name: 'SQL: Table & Column Names',
      scope: [
        'source.sql constant.other.database-name',
        'source.sql constant.other.table-name'
      ],
      settings: {
        foreground: theme.syntax.type
      }
    },

    // Rust
    {
      name: 'Rust: Lifetimes & Macros (Panic / Caution)',
      scope: [
        'source.rust storage.modifier.lifetime',
        'source.rust entity.name.function.macro'
      ],
      settings: {
        foreground: theme.syntax.function,
        fontStyle: 'bold'
      }
    },

    // Go
    {
      name: 'Go: Packages & Channels',
      scope: [
        'source.go entity.name.package',
        'source.go keyword.channel'
      ],
      settings: {
        foreground: theme.syntax.keyword,
        fontStyle: 'bold'
      }
    },

    // Kotlin & Swift
    {
      name: 'Kotlin/Swift: Annotations & Optionals',
      scope: [
        'source.kotlin storage.type.annotation',
        'source.swift storage.type.annotation',
        'source.swift keyword.other.declaration-specifier'
      ],
      settings: {
        foreground: theme.syntax.function
      }
    },

    // Dart / Flutter
    {
      name: 'Dart: Annotations & Widgets',
      scope: [
        'source.dart storage.type.annotation',
        'source.dart support.class.flutter'
      ],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },

    // -------------------------------------------------------------
    // LANGUAGE-SPECIFIC SCOPES: CONFIG & SECRETS (.env, .json, .yaml, .toml, .ini)
    // -------------------------------------------------------------
    {
      name: 'Config: JSON Property Names (Safe / Green)',
      scope: ['source.json support.type.property-name'],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Config: YAML Keys (Safe / Green)',
      scope: ['source.yaml entity.name.tag'],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Config: TOML Table Headers & Keys (Safe)',
      scope: [
        'source.toml entity.other.attribute-name.table',
        'source.toml keyword.key'
      ],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Config: INI Section Headers & Properties',
      scope: [
        'source.ini entity.name.section',
        'source.ini keyword.other.definition'
      ],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Config: ENV Sensitive Keys (Panic / Red Alert)',
      scope: [
        'source.env variable.other.key',
        'source.dotenv variable.other.key',
        'source.env keyword.other'
      ],
      settings: {
        foreground: theme.panic.fg,
        background: theme.panic.bg,
        fontStyle: 'bold'
      }
    },

    // -------------------------------------------------------------
    // LANGUAGE-SPECIFIC SCOPES: DOCS & PROSE (Markdown, Plain Text, HTML, XML)
    // -------------------------------------------------------------
    {
      name: 'Markdown: Clean Prose (Un-tinted Natural Reading)',
      scope: [
        'text.html.markdown',
        'text.plain',
        'meta.paragraph.markdown'
      ],
      settings: {
        foreground: theme.fg
      }
    },
    {
      name: 'Markdown: Headings (Caution / Bold)',
      scope: [
        'text.html.markdown markup.heading',
        'text.html.markdown entity.name.section',
        'text.html.markdown punctuation.definition.heading'
      ],
      settings: {
        foreground: theme.syntax.keyword,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Markdown: Inline & Fenced Code (Safe / Green Badge)',
      scope: [
        'text.html.markdown markup.inline.raw',
        'text.html.markdown markup.fenced_code'
      ],
      settings: {
        foreground: theme.safe.fg,
        background: theme.safe.bg
      }
    },
    {
      name: 'Markdown: Links & URLs (Safe / Blue)',
      scope: [
        'text.html.markdown markup.underline.link',
        'text.html.markdown string.other.link'
      ],
      settings: {
        foreground: theme.accent,
        fontStyle: 'underline'
      }
    },
    {
      name: 'Markdown: Quotes & Notes (Warning / Amber)',
      scope: [
        'text.html.markdown markup.quote'
      ],
      settings: {
        foreground: theme.syntax.comment,
        fontStyle: 'italic'
      }
    },
    {
      name: 'HTML & XML: Element Tags',
      scope: [
        'text.html entity.name.tag',
        'text.xml entity.name.tag'
      ],
      settings: {
        foreground: theme.syntax.tag,
        fontStyle: 'bold'
      }
    },
    {
      name: 'HTML & XML: Attributes',
      scope: [
        'text.html entity.other.attribute-name',
        'text.xml entity.other.attribute-name'
      ],
      settings: {
        foreground: theme.syntax.attribute
      }
    },

    // -------------------------------------------------------------
    // LANGUAGE-SPECIFIC SCOPES: LOG FILES (.log)
    // -------------------------------------------------------------
    {
      name: 'Log: Error & Fatal (Panic / Red Alert)',
      scope: [
        'log.error',
        'log.fatal',
        'log.critical',
        'log.exception'
      ],
      settings: {
        foreground: theme.panic.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Log: Warning (Warning / Amber)',
      scope: [
        'log.warning',
        'log.warn'
      ],
      settings: {
        foreground: theme.warning.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Log: Info & Success (Safe / Green)',
      scope: [
        'log.info',
        'log.notice'
      ],
      settings: {
        foreground: theme.safe.fg,
        fontStyle: 'bold'
      }
    },
    {
      name: 'Log: Debug & Trace (Caution / Subtle)',
      scope: [
        'log.debug',
        'log.trace'
      ],
      settings: {
        foreground: theme.caution.fg
      }
    },
    {
      name: 'Log: Date & Timestamp',
      scope: [
        'log.date',
        'log.timestamp'
      ],
      settings: {
        foreground: theme.fgMuted
      }
    }
  ];

  // Semantic Token Colors (for VS Code Semantic Highlighting engine)
  // Expanded taxonomy: offloads syntax highlighting from regex-based TextMate
  // scopes to the native AST-based semantic engine for better performance.
  const semanticTokenColors = {
    // --- Types & Contracts (Safe / Green) ---
    'class': { foreground: theme.syntax.type, bold: true },
    'class.declaration': { foreground: theme.syntax.type, bold: true },
    'interface': { foreground: theme.safe.fg, bold: true },
    'interface.declaration': { foreground: theme.safe.fg, bold: true },
    'enum': { foreground: theme.syntax.type, bold: true },
    'enum.declaration': { foreground: theme.syntax.type, bold: true },
    'enumMember': { foreground: theme.syntax.constant },
    'struct': { foreground: theme.syntax.type, bold: true },
    'struct.declaration': { foreground: theme.syntax.type, bold: true },
    'type': { foreground: theme.syntax.type },
    'type.declaration': { foreground: theme.syntax.type, bold: true },
    'typeParameter': { foreground: theme.syntax.type, italic: true },
    'builtinType': { foreground: theme.syntax.type, bold: true },

    // --- Functions & Methods ---
    'function': { foreground: theme.syntax.function },
    'function.declaration': { foreground: theme.syntax.function, bold: true },
    'function.defaultLibrary': { foreground: theme.syntax.function, bold: true },
    'method': { foreground: theme.syntax.function },
    'method.declaration': { foreground: theme.syntax.function, bold: true },
    'method.static': { foreground: theme.syntax.function, bold: true },
    'decorator': { foreground: theme.syntax.function, italic: true },
    'macro': { foreground: theme.syntax.function, bold: true },

    // --- Variables & Properties ---
    'variable': { foreground: theme.syntax.variable },
    'variable.declaration': { foreground: theme.syntax.variable, bold: true },
    'variable.readonly': { foreground: theme.syntax.constant },
    'variable.static': { foreground: theme.syntax.constant, bold: true },
    'variable.defaultLibrary': { foreground: theme.syntax.constant, bold: true },
    'property': { foreground: theme.syntax.property },
    'property.declaration': { foreground: theme.syntax.property },
    'property.readonly': { foreground: theme.syntax.constant },
    'property.static': { foreground: theme.syntax.constant, bold: true },

    // --- Parameters & Dynamic Inputs (Caution / Yellow) ---
    'parameter': { foreground: theme.caution.fg },
    'parameter.declaration': { foreground: theme.caution.fg, italic: true },

    // --- Namespaces & Modules ---
    'namespace': { foreground: theme.accent },
    'namespace.declaration': { foreground: theme.accent, bold: true },
    'module': { foreground: theme.accent },
    'module.declaration': { foreground: theme.accent, bold: true },

    // --- Constants & Literals ---
    'number': { foreground: theme.syntax.number },
    'builtinConstant': { foreground: theme.syntax.constant, bold: true },
    'constant': { foreground: theme.syntax.constant },
    'label': { foreground: theme.syntax.constant, italic: true },

    // --- Strings (Warning / Amber for hardcoded literals) ---
    'string': { foreground: theme.warning.fg },
    'string.docstring': { foreground: theme.syntax.comment, italic: true },
    'string.readonly': { foreground: theme.syntax.comment, italic: true },

    // --- Keywords & Control Flow ---
    'keyword': { foreground: theme.syntax.keyword, bold: true },
    'keyword.control': { foreground: theme.syntax.keyword, bold: true },
    'keyword.modifier': { foreground: theme.syntax.keyword },
    'keyword.declaration': { foreground: theme.syntax.keyword, bold: true },

    // --- Operators ---
    'operator': { foreground: theme.syntax.operator },

    // --- Comments ---
    'comment': { foreground: theme.syntax.comment, italic: true },
    'comment.line': { foreground: theme.syntax.comment, italic: true },
    'comment.block': { foreground: theme.syntax.comment, italic: true },
    'comment.documentation': { foreground: theme.syntax.comment, italic: true },

    // --- Regex & Patterns (Panic / Red Alert) ---
    'regexp': { foreground: theme.panic.fg },
    'regexp.escape': { foreground: theme.panic.fg, bold: true },

    // --- Events ---
    'event': { foreground: theme.syntax.function, italic: true },
    'event.declaration': { foreground: theme.syntax.function, bold: true, italic: true },

    // --- Deprecated ---
    'variable.deprecated': { foreground: theme.panic.fg, strikethrough: true },
    'property.deprecated': { foreground: theme.panic.fg, strikethrough: true },
    'function.deprecated': { foreground: theme.panic.fg, strikethrough: true },
    'method.deprecated': { foreground: theme.panic.fg, strikethrough: true }
  };

  return {
    $schema: 'vscode://schemas/color-theme',
    name: theme.name,
    type: theme.type === 'hc-light' ? 'hcLight'
      : theme.type === 'hc-dark' ? 'hcDark'
      : theme.type === 'dark' ? 'dark'
      : 'light',
    author: 'Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)',
    license: 'AGPL-3.0',
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors
  };
}

// Generate all 20 theme JSON files (10 Light + 10 Night)
const allThemes = [...themeDefinitions, ...darkThemeDefinitions];
console.log(`🚀 Generating ZeroToSaaS ${allThemes.length} Accessible Themes (10 Light + 10 Night)...`);
allThemes.forEach(theme => {
  const filePath = path.join(THEMES_DIR, `${theme.id}.json`);
  const jsonContent = JSON.stringify(buildThemeJson(theme), null, 2);
  fs.writeFileSync(filePath, jsonContent, 'utf8');
  console.log(` ✅ Generated: themes/${theme.id}.json (${theme.name})`);
});
console.log(`✨ All ${allThemes.length} themes generated successfully.`);
