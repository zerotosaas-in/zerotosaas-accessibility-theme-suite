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

// Shared color-science math for the ZeroToSaaS theme suite.
// Consumed by scripts/validate-contrast.js and scripts/generate-themes.js
// so that OkLCH / WCAG / CVD logic is defined exactly once (DRY).

function parseHex(hex) {
  let clean = String(hex).replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length === 8) {
    clean = clean.substring(0, 6); // ignore alpha for base luminance calculation
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function sRgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSRgb(c) {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, v)) * 255);
}

function relativeLuminance(hex) {
  const { r, g, b } = parseHex(hex);
  const rLin = sRgbToLinear(r);
  const gLin = sRgbToLinear(g);
  const bLin = sRgbToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Analytical sRGB -> LMS -> Oklab -> OkLCH (Björn Ottosson's Oklab).
function hexToOklch(hex) {
  const { r, g, b } = parseHex(hex);
  const rLin = sRgbToLinear(r);
  const gLin = sRgbToLinear(g);
  const bLin = sRgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin);
  const m = Math.cbrt(0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin);
  const s = Math.cbrt(0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin);

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const bCoord = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

  const C = Math.sqrt(a * a + bCoord * bCoord);
  let h = (Math.atan2(bCoord, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { L, C, h, a, bCoord };
}

// Oklab -> linear sRGB -> sRGB. Inverse of hexToOklch.
function oklchToHex(L, C, h) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const bCoord = C * Math.sin(hr);

  const l = L + 0.3963377774 * a + 0.2158037573 * bCoord;
  const m = L - 0.1055613458 * a - 0.0638541728 * bCoord;
  const s = L - 0.0894841775 * a - 1.2914855480 * bCoord;

  const l3 = l * l * l;
  const m3 = m * m * m;
  const s3 = s * s * s;

  const rLin = 4.0767416621 * l3 - 3.3079874708 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574051 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const r = linearToSRgb(rLin);
  const g = linearToSRgb(gLin);
  const b = linearToSRgb(bLin);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Paul Tol & Oklab Euclidean perceptual color distance (Delta E Ok).
function deltaEOklab(c1, c2) {
  const dL = c1.L - c2.L;
  const da = c1.a - c2.a;
  const db = c1.bCoord - c2.bCoord;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Farnsworth-Munsell 100-Hue Clinical Quadrant Mapper.
function getFmQuadrant(hue) {
  if (hue >= 0 && hue < 90) return 'FM Quadrant I (Red-Yellow / Alert Axis)';
  if (hue >= 90 && hue < 180) return 'FM Quadrant II (Yellow-Green / Growth & Safe Axis)';
  if (hue >= 180 && hue < 270) return 'FM Quadrant III (Green-Cyan / Blue Structure Axis)';
  return 'FM Quadrant IV (Blue-Violet / Magenta Function Axis)';
}

// Cynthia Brewer's ColorBrewer Scale Classifier.
function getColorBrewerScale(tokenName) {
  const name = tokenName ? tokenName.toLowerCase() : '';
  if (name.includes('safe') || name.includes('caution') || name.includes('warning') || name.includes('panic') || name.includes('diff') || name.includes('status')) {
    return 'Diverging (Cognitive Status & Severity)';
  }
  if (name.includes('indent') || name.includes('guide') || name.includes('level') || name.includes('number') || name.includes('depth')) {
    return 'Sequential (Structural Depth & Order)';
  }
  return 'Qualitative (Nominal Syntax Differentiation)';
}

// Invert the perceptual lightness of a hex color while preserving hue and chroma.
// Used to derive dark palettes from light palettes (polarity inversion, not hue rotation).
//
// - targetL: target OkLCH L in [0,1] (e.g. 0.20 for canvas, 0.92 for foreground).
// - keepChroma: when true, preserve the original chroma; when false, optionally
//   scale chroma via chromaScale (useful for canvas where glare must stay low).
// - chromaScale: multiplier applied to original chroma (default 1.0).
// - minChroma: clamp chroma to this minimum (default 0).
// - maxChroma: clamp chroma to this maximum (default Infinity).
function invertLightness(hex, targetL, opts = {}) {
  const { keepChroma = true, chromaScale = 1.0, minChroma = 0, maxChroma = Infinity } = opts;
  const ok = hexToOklch(hex);
  const C = keepChroma
    ? Math.min(maxChroma, Math.max(minChroma, ok.C * chromaScale))
    : Math.min(maxChroma, Math.max(minChroma, ok.C));
  return oklchToHex(Math.max(0, Math.min(1, targetL)), C, ok.h);
}

// Convenience: derive a dark canvas stack from a light palette's bg.
// Returns { bg, bgSubtle, bgSidebar, bgActivityBar } with progressively
// elevated lightness layers, all preserving the original hue and low chroma.
function deriveDarkCanvasStack(lightBg, baseL = 0.16) {
  const ok = hexToOklch(lightBg);
  // Dark canvases emit less light than light canvases, so slightly higher
  // chroma is safe from a glare standpoint (Guidelines §3A: C ≤ 0.010 for
  // light canvases; dark canvases tolerate ~2x that without retinal glare).
  // A touch more chroma preserves each theme's chromatic identity and aids
  // ambient lighting matching (Guidelines §1B: "Match the Room").
  const clampChroma = Math.min(Math.max(ok.C, 0.012), 0.022);
  return {
    bg: oklchToHex(baseL, clampChroma, ok.h),
    bgSubtle: oklchToHex(baseL + 0.025, clampChroma, ok.h),
    bgSidebar: oklchToHex(baseL + 0.04, clampChroma, ok.h),
    bgActivityBar: oklchToHex(baseL + 0.055, clampChroma, ok.h)
  };
}

module.exports = {
  parseHex,
  sRgbToLinear,
  linearToSRgb,
  relativeLuminance,
  contrastRatio,
  hexToOklch,
  oklchToHex,
  deltaEOklab,
  getFmQuadrant,
  getColorBrewerScale,
  invertLightness,
  deriveDarkCanvasStack
};
