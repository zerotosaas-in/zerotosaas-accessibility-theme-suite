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

// Design Token Exporter + Terminal Color Scheme Generator.
//
// Reads all 20 themes/*.json and emits:
//   tokens/zerotosaas.css            — CSS custom properties (root = default light,
//                                      per-variant blocks under [data-z2s-theme="..."])
//   tokens/tailwind.preset.js        — Tailwind v3 preset (colors.z2s.*)
//   tokens/tailwind.v4.css           — Tailwind v4 @theme preset (--color-z2s-*)
//   tokens/zerotosaas.json           — Style Dictionary / Figma Tokens Studio format
//   terminals/iterm2/<slug>.itermcolors
//   terminals/windows-terminal/<slug>.json
//   terminals/alacritty/<slug>.toml
//   terminals/kitty/<slug>.conf
//   terminals/ghostty/<slug>.conf
//   terminals/warp/<slug>.yaml
//   terminals/macos-terminal/<slug>.terminal  (requires plutil — macOS only)
//
// Token names are derived deterministically from the existing theme JSON structure
// (editor.background -> --z2s-canvas, tokenColors[].name -> --z2s-<kebab-name>).
// No new source-of-truth file is introduced.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'themes');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const TERMINALS_DIR = path.join(ROOT, 'terminals');

// --- helpers --------------------------------------------------------------

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, 'utf8');
}

// Strip a leading # and any trailing alpha bytes from a hex color so terminal
// formats that require #RRGGBB don't receive #RRGGBBAA.
function rgbHex(hex) {
  let clean = String(hex).replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length === 8) clean = clean.substring(0, 6);
  return `#${clean.toUpperCase()}`;
}

// --- theme loading --------------------------------------------------------

function loadThemes() {
  return fs
    .readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const theme = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, file), 'utf8'));
      theme._file = file;
      theme._slug = path.basename(file, '.json').replace(/^zerotosaas-/, '');
      return theme;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Curated semantic token names mapped to theme color keys / tokenColor names.
// `key` is the theme.colors key; `tokenName` (when set) is a tokenColors[].name
// substring match used as a fallback.
const SEMANTIC_TOKENS = [
  { token: 'canvas', key: 'editor.background' },
  { token: 'fg', key: 'editor.foreground' },
  { token: 'selection', key: 'editor.selectionBackground' },
  { token: 'panic-fg', key: 'errorForeground' },
  { token: 'warning-fg', key: 'editorWarning.foreground' },
  { token: 'info-fg', key: 'editorInfo.foreground' },
  { token: 'safe-fg', key: 'editorHint.foreground' },
  { token: 'caution-fg', key: 'inputValidation.warningBorder' },
  { token: 'focus-border', key: 'focusBorder' },
  { token: 'activity-bar-bg', key: 'activityBar.background' },
  { token: 'sidebar-bg', key: 'sideBar.background' },
  { token: 'status-bar-bg', key: 'statusBar.background' },
  { token: 'cursor', key: 'editorCursor.foreground' },
  { token: 'line-number', key: 'editorLineNumber.foreground' },
  { token: 'indent-guide', key: 'editorIndentGuide.background' },
];

// Resolve a tokenColor foreground by matching its name (case-insensitive contains).
function findTokenColorFg(theme, nameSubstring) {
  const needle = nameSubstring.toLowerCase();
  const match = theme.tokenColors.find(
    (tc) => tc.name && tc.name.toLowerCase().includes(needle) && tc.settings && tc.settings.foreground
  );
  return match ? match.settings.foreground : null;
}

// Build the full token map for a single theme.
function buildTokenMap(theme) {
  const map = {};
  for (const { token, key } of SEMANTIC_TOKENS) {
    if (theme.colors[key]) map[token] = theme.colors[key];
  }
  // Per-syntax-token slugs from tokenColors[].name.
  const seen = new Set();
  for (const tc of theme.tokenColors) {
    if (!tc.name || !tc.settings || !tc.settings.foreground) continue;
    const slug = slugify(tc.name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    map[slug] = tc.settings.foreground;
  }
  return map;
}

// --- CSS export -----------------------------------------------------------

function cssVarName(token) {
  return `--z2s-${token}`;
}

function emitCss(themes) {
  const lines = [];
  lines.push('/* ZeroToSaaS Accessibility Theme Suite — Design Tokens (CSS Custom Properties)');
  lines.push('   Generated by scripts/export-tokens.js — do not edit by hand.');
  lines.push('   Root block = default light theme; per-variant overrides via [data-z2s-theme="<slug>"]. */');
  lines.push('');

  const defaultTheme = themes.find((t) => t._slug === 'light') || themes[0];
  const variants = themes.filter((t) => t !== defaultTheme);

  // Root = default theme.
  lines.push(':root {');
  const defaultMap = buildTokenMap(defaultTheme);
  for (const [token, hex] of Object.entries(defaultMap)) {
    lines.push(`  ${cssVarName(token)}: ${rgbHex(hex)};`);
  }
  lines.push('}');
  lines.push('');

  // Per-variant overrides.
  for (const theme of variants) {
    lines.push(`[data-z2s-theme="${theme._slug}"] {`);
    const map = buildTokenMap(theme);
    for (const [token, hex] of Object.entries(map)) {
      lines.push(`  ${cssVarName(token)}: ${rgbHex(hex)};`);
    }
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

// --- Tailwind preset export ----------------------------------------------

function emitTailwindPreset(themes) {
  const defaultTheme = themes.find((t) => t._slug === 'light') || themes[0];
  const map = buildTokenMap(defaultTheme);
  // Curated subset for the Tailwind color palette (semantic + key syntax roles).
  const palette = {
    canvas: map['canvas'],
    fg: map['fg'],
    selection: map['selection'],
    'panic-fg': map['panic-fg'],
    'warning-fg': map['warning-fg'],
    'info-fg': map['info-fg'],
    'safe-fg': map['safe-fg'],
    'caution-fg': map['caution-fg'],
    'focus-border': map['focus-border'],
    keywords: map['keywords-control-flow'],
    functions: map['functions-methods'],
    types: map['types-classes-structs-interfaces'],
    constants: map['constants-language-built-ins'],
    variables: map['variables-identifiers'],
    comments: map['comments-documentation'],
  };
  // Strip undefined entries.
  const clean = {};
  for (const [k, v] of Object.entries(palette)) {
    if (v) clean[k] = rgbHex(v);
  }

  const body = `// ZeroToSaaS Accessibility Theme Suite — Tailwind v3 preset.
// Generated by scripts/export-tokens.js — do not edit by hand.
// Usage: module.exports = { presets: [require('./tokens/tailwind.preset.js')] };
// Dark/night variants: switch via [data-z2s-theme*="night"] selector
// (see tokens/zerotosaas.css for the full per-variant override blocks).

/** @type {import('tailwindcss/tailwind-config').Config} */
module.exports = {
  darkMode: ['selector', '[data-z2s-theme*="night"]'],
  theme: {
    extend: {
      colors: {
        z2s: ${JSON.stringify(clean, null, 8).replace(/^/gm, '        ').trimStart()},
      },
    },
  },
};
`;
  return body;
}

// --- Tailwind v4 CSS preset (@theme) -------------------------------------

function emitTailwindV4(themes) {
  const defaultTheme = themes.find((t) => t._slug === 'light') || themes[0];
  const variants = themes.filter((t) => t !== defaultTheme);

  // Curated palette keys (same subset as v3, mapped to --color-z2s-* names).
  const paletteKeys = [
    'canvas', 'fg', 'selection',
    'panic-fg', 'warning-fg', 'info-fg', 'safe-fg', 'caution-fg',
    'focus-border',
    'keywords-control-flow', 'functions-methods',
    'types-classes-structs-interfaces', 'constants-language-built-ins',
    'variables-identifiers', 'comments-documentation',
  ];

  // Short names for the curated palette (matching v3 keys).
  const shortNames = {
    'keywords-control-flow': 'keywords',
    'functions-methods': 'functions',
    'types-classes-structs-interfaces': 'types',
    'constants-language-built-ins': 'constants',
    'variables-identifiers': 'variables',
    'comments-documentation': 'comments',
  };

  const lines = [];
  lines.push('/* ZeroToSaaS Accessibility Theme Suite — Tailwind CSS v4 preset.');
  lines.push('   Generated by scripts/export-tokens.js — do not edit by hand.');
  lines.push('   Usage: @import "tailwindcss"; @import "./tokens/tailwind.v4.css";');
  lines.push('   Dark/night variants: override via [data-z2s-theme*="night"] selector. */');
  lines.push('');

  // @theme block = default light theme.
  lines.push('@theme {');
  const defaultMap = buildTokenMap(defaultTheme);
  for (const key of paletteKeys) {
    if (!defaultMap[key]) continue;
    const name = shortNames[key] || key;
    lines.push(`  --color-z2s-${name}: ${rgbHex(defaultMap[key])};`);
  }
  lines.push('}');
  lines.push('');

  // Per-variant overrides (all 19 non-default themes).
  for (const theme of variants) {
    lines.push(`[data-z2s-theme="${theme._slug}"] {`);
    const map = buildTokenMap(theme);
    for (const key of paletteKeys) {
      if (!map[key]) continue;
      const name = shortNames[key] || key;
      lines.push(`  --color-z2s-${name}: ${rgbHex(map[key])};`);
    }
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

// --- Style Dictionary / Figma Tokens Studio JSON -------------------------

function emitTokensJson(themes) {
  const out = {};
  for (const theme of themes) {
    const map = buildTokenMap(theme);
    const colorObj = {};
    for (const [token, hex] of Object.entries(map)) {
      // Nested by hyphen group so Style Dictionary can traverse color.canvas etc.
      const parts = token.split('-');
      let node = colorObj;
      for (let i = 0; i < parts.length - 1; i++) {
        node[parts[i]] = node[parts[i]] || {};
        node = node[parts[i]];
      }
      node[parts[parts.length - 1]] = { value: rgbHex(hex), type: 'color' };
    }
    out[theme.name] = { color: colorObj };
  }
  return JSON.stringify(out, null, 2);
}

// --- Terminal exports -----------------------------------------------------

// ANSI 0-15 + bg/fg/cursor, sourced from the theme's own terminal.ansi* keys
// (every ZeroToSaaS theme defines them). Falls back to editor bg/fg if missing.
function ansiPalette(theme) {
  const c = theme.colors;
  const get = (k, fallback) => (c[k] ? rgbHex(c[k]) : fallback);
  return {
    background: get('terminal.background', rgbHex(c['editor.background'])),
    foreground: get('terminal.foreground', rgbHex(c['editor.foreground'])),
    cursor: get('terminalCursor.foreground', get('editorCursor.foreground', rgbHex(c['editor.foreground']))),
    selection: get('terminal.selectionBackground', get('editor.selectionBackground', '#B8D6F8B3')),
    black: get('terminal.ansiBlack', '#111827'),
    red: get('terminal.ansiRed', '#990014'),
    green: get('terminal.ansiGreen', '#0B6229'),
    yellow: get('terminal.ansiYellow', '#784A00'),
    blue: get('terminal.ansiBlue', '#0B4F9C'),
    magenta: get('terminal.ansiMagenta', '#4F2683'),
    cyan: get('terminal.ansiCyan', '#0B6229'),
    white: get('terminal.ansiWhite', '#F6F8FB'),
    brightBlack: get('terminal.ansiBrightBlack', '#485260'),
    brightRed: get('terminal.ansiBrightRed', '#990014'),
    brightGreen: get('terminal.ansiBrightGreen', '#0B6229'),
    brightYellow: get('terminal.ansiBrightYellow', '#784A00'),
    brightBlue: get('terminal.ansiBrightBlue', '#003D99'),
    brightMagenta: get('terminal.ansiBrightMagenta', '#4F2683'),
    brightCyan: get('terminal.ansiBrightCyan', '#0B6229'),
    brightWhite: get('terminal.ansiBrightWhite', '#111827'),
  };
}

// iTerm2 .itermcolors — plist XML.
function emitIterm2(theme, p) {
  const colorDict = (key, hex) => {
    const { r, g, b } = parseHexRgb(hex);
    return `	<key>${key}</key>
	<dict>
		<key>Color Space</key>
		<string>sRGB</string>
		<key>Red Component</key>
		<real>${(r / 255).toFixed(6)}</real>
		<key>Green Component</key>
		<real>${(g / 255).toFixed(6)}</real>
		<key>Blue Component</key>
		<real>${(b / 255).toFixed(6)}</real>
	</dict>`;
  };
  const blocks = [
    colorDict('Background Color', p.background),
    colorDict('Foreground Color', p.foreground),
    colorDict('Cursor Color', p.cursor),
    colorDict('Selection Color', p.selection),
    colorDict('Ansi 0 Color', p.black),
    colorDict('Ansi 1 Color', p.red),
    colorDict('Ansi 2 Color', p.green),
    colorDict('Ansi 3 Color', p.yellow),
    colorDict('Ansi 4 Color', p.blue),
    colorDict('Ansi 5 Color', p.magenta),
    colorDict('Ansi 6 Color', p.cyan),
    colorDict('Ansi 7 Color', p.white),
    colorDict('Ansi 8 Color', p.brightBlack),
    colorDict('Ansi 9 Color', p.brightRed),
    colorDict('Ansi 10 Color', p.brightGreen),
    colorDict('Ansi 11 Color', p.brightYellow),
    colorDict('Ansi 12 Color', p.brightBlue),
    colorDict('Ansi 13 Color', p.brightMagenta),
    colorDict('Ansi 14 Color', p.brightCyan),
    colorDict('Ansi 15 Color', p.brightWhite),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${blocks.join('\n')}
</dict>
</plist>
`;
}

function parseHexRgb(hex) {
  let clean = String(hex).replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  if (clean.length === 8) clean = clean.substring(0, 6);
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

// Windows Terminal scheme JSON.
function emitWindowsTerminal(theme, p) {
  const scheme = {
    name: theme.name,
    background: p.background,
    foreground: p.foreground,
    cursorColor: p.cursor,
    selectionBackground: p.selection,
    black: p.black,
    red: p.red,
    green: p.green,
    yellow: p.yellow,
    blue: p.blue,
    purple: p.magenta,
    cyan: p.cyan,
    white: p.white,
    brightBlack: p.brightBlack,
    brightRed: p.brightRed,
    brightGreen: p.brightGreen,
    brightYellow: p.brightYellow,
    brightBlue: p.brightBlue,
    brightPurple: p.brightMagenta,
    brightCyan: p.brightCyan,
    brightWhite: p.brightWhite,
  };
  return JSON.stringify(scheme, null, 2);
}

// Alacritty .toml.
function emitAlacritty(theme, p) {
  return `# ${theme.name} — Alacritty color scheme.
# Generated by scripts/export-tokens.js.

[colors.primary]
background = "${p.background}"
foreground = "${p.foreground}"

[colors.cursor]
cursor = "${p.cursor}"
text = "${p.background}"

[colors.selection]
background = "${p.selection}"
text = "${p.foreground}"

[colors.normal]
black = "${p.black}"
red = "${p.red}"
green = "${p.green}"
yellow = "${p.yellow}"
blue = "${p.blue}"
magenta = "${p.magenta}"
cyan = "${p.cyan}"
white = "${p.white}"

[colors.bright]
black = "${p.brightBlack}"
red = "${p.brightRed}"
green = "${p.brightGreen}"
yellow = "${p.brightYellow}"
blue = "${p.brightBlue}"
magenta = "${p.brightMagenta}"
cyan = "${p.brightCyan}"
white = "${p.brightWhite}"
`;
}

// Kitty .conf.
function emitKitty(theme, p) {
  const lines = [
    `# ${theme.name} — Kitty color scheme.`,
    '# Generated by scripts/export-tokens.js.',
    '',
    `background ${p.background}`,
    `foreground ${p.foreground}`,
    `cursor ${p.cursor}`,
    `selection_background ${p.selection}`,
    `selection_foreground ${p.foreground}`,
    `color0 ${p.black}`,
    `color1 ${p.red}`,
    `color2 ${p.green}`,
    `color3 ${p.yellow}`,
    `color4 ${p.blue}`,
    `color5 ${p.magenta}`,
    `color6 ${p.cyan}`,
    `color7 ${p.white}`,
    `color8 ${p.brightBlack}`,
    `color9 ${p.brightRed}`,
    `color10 ${p.brightGreen}`,
    `color11 ${p.brightYellow}`,
    `color12 ${p.brightBlue}`,
    `color13 ${p.brightMagenta}`,
    `color14 ${p.brightCyan}`,
    `color15 ${p.brightWhite}`,
  ];
  return lines.join('\n') + '\n';
}

// Ghostty .conf.
function emitGhostty(theme, p) {
  const lines = [
    `# ${theme.name} — Ghostty color scheme.`,
    '# Generated by scripts/export-tokens.js.',
    '',
    `background = ${p.background}`,
    `foreground = ${p.foreground}`,
    `cursor-color = ${p.cursor}`,
    `selection-background = ${p.selection}`,
    `selection-foreground = ${p.foreground}`,
    `palette = 0=${p.black}`,
    `palette = 1=${p.red}`,
    `palette = 2=${p.green}`,
    `palette = 3=${p.yellow}`,
    `palette = 4=${p.blue}`,
    `palette = 5=${p.magenta}`,
    `palette = 6=${p.cyan}`,
    `palette = 7=${p.white}`,
    `palette = 8=${p.brightBlack}`,
    `palette = 9=${p.brightRed}`,
    `palette = 10=${p.brightGreen}`,
    `palette = 11=${p.brightYellow}`,
    `palette = 12=${p.brightBlue}`,
    `palette = 13=${p.brightMagenta}`,
    `palette = 14=${p.brightCyan}`,
    `palette = 15=${p.brightWhite}`,
  ];
  return lines.join('\n') + '\n';
}

// Warp .yaml.
function emitWarp(theme, p) {
  const lines = [
    `# ${theme.name} — Warp theme.`,
    '# Generated by scripts/export-tokens.js.',
    '',
    `background: '${p.background}'`,
    `foreground: '${p.foreground}'`,
    `details: 'darker'`,
    `cursor: '${p.cursor}'`,
    `selection: '${p.selection}'`,
    `ansi_colors:`,
    `  - { normal: '${p.black}',    bright: '${p.brightBlack}' }`,
    `  - { normal: '${p.red}',      bright: '${p.brightRed}' }`,
    `  - { normal: '${p.green}',    bright: '${p.brightGreen}' }`,
    `  - { normal: '${p.yellow}',   bright: '${p.brightYellow}' }`,
    `  - { normal: '${p.blue}',     bright: '${p.brightBlue}' }`,
    `  - { normal: '${p.magenta}',  bright: '${p.brightMagenta}' }`,
    `  - { normal: '${p.cyan}',     bright: '${p.brightCyan}' }`,
    `  - { normal: '${p.white}',    bright: '${p.brightWhite}' }`,
  ];
  return lines.join('\n') + '\n';
}

// macOS Terminal.app .terminal — XML plist with NSKeyedArchiver color blobs.
// Requires `plutil` (macOS only). Skipped gracefully on other platforms.
//
// Terminal.app expects NSColorSpace=2 (NSCalibratedRGBColorSpace) and the
// NSRGB data as a null-terminated ASCII string "R G B\x00" (3 floats, no alpha).
// The overall plist must include type="Window Settings" and ProfileCurrentVersion.
function emitMacosTerminal(theme, p) {
  // Build an NSKeyedArchiver XML plist for a single NSColor.
  // NSColorSpace=2 (NSCalibratedRGBColorSpace), NSRGB="R G B" + null byte.
  function nsColorArchive(hex) {
    const { r, g, b } = parseHexRgb(hex);
    // Format: "R G B" followed by a null byte (0x00). No alpha value.
    const rgbStr = `${(r / 255).toFixed(10)} ${(g / 255).toFixed(10)} ${(b / 255).toFixed(10)}`;
    const nsrgbBase64 = Buffer.from(rgbStr + '\0', 'ascii').toString('base64');
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>$archiver</key>
	<string>NSKeyedArchiver</string>
	<key>$objects</key>
	<array>
		<string>$null</string>
		<dict>
			<key>$class</key>
			<dict>
				<key>CF$UID</key>
				<integer>2</integer>
			</dict>
			<key>NSColorSpace</key>
			<integer>2</integer>
			<key>NSRGB</key>
			<data>${nsrgbBase64}</data>
		</dict>
		<dict>
			<key>$classname</key>
			<string>NSColor</string>
			<key>$classes</key>
			<array>
				<string>NSColor</string>
				<string>NSObject</string>
			</array>
		</dict>
	</array>
	<key>$top</key>
	<dict>
		<key>root</key>
		<dict>
			<key>CF$UID</key>
			<integer>1</integer>
		</dict>
	</dict>
	<key>$version</key>
	<integer>100000</integer>
</dict>
</plist>`;
  }

  // Convert an NSKeyedArchiver XML plist to base64-encoded binary plist via plutil.
  function nsColorBase64(hex) {
    const tmpFile = path.join(ROOT, 'tokens', '.tmp-color-archiver.plist');
    const xmlPlist = nsColorArchive(hex);
    fs.writeFileSync(tmpFile, xmlPlist, 'utf8');
    try {
      execSync(`plutil -convert binary1 "${tmpFile}"`, { stdio: 'pipe' });
      const binaryData = fs.readFileSync(tmpFile);
      return binaryData.toString('base64');
    } finally {
      try { fs.unlinkSync(tmpFile); } catch (e) { /* ignore */ }
    }
  }

  // Color key mapping for Terminal.app .terminal plist.
  const colorEntries = [
    ['BackgroundColor', p.background],
    ['TextColor', p.foreground],
    ['TextBoldColor', p.foreground],
    ['CursorColor', p.cursor],
    ['SelectionColor', p.selection],
    ['ANSIBlackColor', p.black],
    ['ANSIRedColor', p.red],
    ['ANSIGreenColor', p.green],
    ['ANSIYellowColor', p.yellow],
    ['ANSIBlueColor', p.blue],
    ['ANSIMagentaColor', p.magenta],
    ['ANSICyanColor', p.cyan],
    ['ANSIWhiteColor', p.white],
    ['ANSIBrightBlackColor', p.brightBlack],
    ['ANSIBrightRedColor', p.brightRed],
    ['ANSIBrightGreenColor', p.brightGreen],
    ['ANSIBrightYellowColor', p.brightYellow],
    ['ANSIBrightBlueColor', p.brightBlue],
    ['ANSIBrightMagentaColor', p.brightMagenta],
    ['ANSIBrightCyanColor', p.brightCyan],
    ['ANSIBrightWhiteColor', p.brightWhite],
  ];

  const dataEntries = colorEntries
    .map(([key, hex]) => `\t<key>${key}</key>\n\t<data>${nsColorBase64(hex)}</data>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>name</key>
	<string>${theme.name}</string>
	<key>ProfileCurrentVersion</key>
	<real>2.09</real>
	<key>type</key>
	<string>Window Settings</string>
${dataEntries}
</dict>
</plist>
`;
}

// --- main -----------------------------------------------------------------

function main() {
  const themes = loadThemes();
  console.log(`🎨 Exporting design tokens + terminal schemes for ${themes.length} themes…\n`);

  // Tokens.
  writeFile(path.join(TOKENS_DIR, 'zerotosaas.css'), emitCss(themes));
  writeFile(path.join(TOKENS_DIR, 'tailwind.preset.js'), emitTailwindPreset(themes));
  writeFile(path.join(TOKENS_DIR, 'tailwind.v4.css'), emitTailwindV4(themes));
  writeFile(path.join(TOKENS_DIR, 'zerotosaas.json'), emitTokensJson(themes));
  console.log(`  ✅ tokens/zerotosaas.css`);
  console.log(`  ✅ tokens/tailwind.preset.js (v3)`);
  console.log(`  ✅ tokens/tailwind.v4.css (v4)`);
  console.log(`  ✅ tokens/zerotosaas.json`);

  // Terminals.
  const terminalFormats = [
    { dir: 'iterm2', ext: 'itermcolors', emit: emitIterm2 },
    { dir: 'windows-terminal', ext: 'json', emit: emitWindowsTerminal },
    { dir: 'alacritty', ext: 'toml', emit: emitAlacritty },
    { dir: 'kitty', ext: 'conf', emit: emitKitty },
    { dir: 'ghostty', ext: 'conf', emit: emitGhostty },
    { dir: 'warp', ext: 'yaml', emit: emitWarp },
  ];

  // macOS Terminal.app requires plutil (macOS only).
  const hasPlutil = (() => {
    try { execSync('which plutil', { stdio: 'pipe' }); return true; } catch (e) { return false; }
  })();

  let terminalCount = 0;
  for (const theme of themes) {
    const p = ansiPalette(theme);
    for (const fmt of terminalFormats) {
      const filePath = path.join(TERMINALS_DIR, fmt.dir, `${theme._slug}.${fmt.ext}`);
      writeFile(filePath, fmt.emit(theme, p));
      terminalCount++;
    }
    // macOS Terminal.app (.terminal) — requires plutil.
    if (hasPlutil) {
      const filePath = path.join(TERMINALS_DIR, 'macos-terminal', `${theme._slug}.terminal`);
      writeFile(filePath, emitMacosTerminal(theme, p));
      terminalCount++;
    }
  }
  const terminalCountLabel = hasPlutil
    ? `${terminalCount} files across ${terminalFormats.length + 1} terminals (incl. macOS Terminal.app)`
    : `${terminalCount} files across ${terminalFormats.length} terminals (macOS Terminal.app skipped — plutil not found)`;
  console.log(`  ✅ terminals/ (${terminalCountLabel})`);

  const totalFiles = 4 + terminalCount;
  console.log(`\n🎉 Export complete: ${totalFiles} files written.`);
}

main();
