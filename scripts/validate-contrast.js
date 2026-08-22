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
// along with this program.  If not, see <https://gnu.org>.

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'themes');

function parseHex(hex) {
  let clean = hex.replace('#', '').trim();
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

console.log('🔍 Validating WCAG AAA Contrast Ratios (Target >= 7.0:1) across all themes...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = [];

const files = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const themePath = path.join(THEMES_DIR, file);
  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const editorBg = theme.colors['editor.background'];
  const editorFg = theme.colors['editor.foreground'];

  console.log(`\n============================================================`);
  console.log(`📄 Theme: ${theme.name} (${file})`);
  console.log(`   Editor Canvas: ${editorBg} | Foreground: ${editorFg}`);
  console.log(`============================================================`);

  // 1. Check base editor text
  const baseRatio = contrastRatio(editorFg, editorBg);
  totalTests++;
  if (baseRatio >= 7.0) {
    passedTests++;
    console.log(`  ✅ Base Text Contrast: ${baseRatio.toFixed(2)}:1 (PASS WCAG AAA)`);
  } else {
    failedTests.push({ theme: theme.name, scope: 'editor.foreground', ratio: baseRatio });
    console.log(`  ❌ Base Text Contrast: ${baseRatio.toFixed(2)}:1 (FAIL WCAG AAA)`);
  }

  // 2. Check token colors
  theme.tokenColors.forEach(token => {
    if (!token.settings || !token.settings.foreground) return;
    const fg = token.settings.foreground;
    const bg = token.settings.background || editorBg;
    const ratio = contrastRatio(fg, bg);
    totalTests++;

    if (ratio >= 7.0) {
      passedTests++;
      console.log(`  ✅ [${token.name || token.scope}] ${fg} on ${bg} -> ${ratio.toFixed(2)}:1 (PASS)`);
    } else {
      failedTests.push({ theme: theme.name, scope: token.name || JSON.stringify(token.scope), ratio, fg, bg });
      console.log(`  ❌ [${token.name || token.scope}] ${fg} on ${bg} -> ${ratio.toFixed(2)}:1 (FAIL)`);
    }
  });
});

console.log(`\n------------------------------------------------------------`);
console.log(`📊 Contrast Validation Summary:`);
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests.length}`);

if (failedTests.length === 0) {
  console.log(`\n🎉 100% OF TOKENS PASS WCAG AAA (>= 7:1 Contrast Ratio)! Perfect compliance.`);
  process.exit(0);
} else {
  console.error(`\n❌ Failed tokens detected:`, failedTests);
  process.exit(1);
}
