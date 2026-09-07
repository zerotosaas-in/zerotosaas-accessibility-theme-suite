const fs = require('fs');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const version = pkg.version;
const extId = `${pkg.publisher}.${pkg.name}`;
const extDirName = `${extId}-${version}`;

function isZerotosaasThemeId(id) {
  return typeof id === 'string' && id.endsWith(`.${pkg.name}`);
}

function isZerotosaasThemeDirName(name) {
  return name.includes(`.${pkg.name}-`);
}

function safeJoin(base, ...segments) {
  for (const seg of segments) {
    if (seg === '..' || seg === '.' || seg.includes('/') || seg.includes('\\')) {
      throw new Error(`Refusing unsafe path segment: ${seg}`);
    }
  }
  // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
  return path.join(base, ...segments);
}

const targets = [
  {
    name: 'Codium',
    extDir: path.join(os.homedir(), '.vscode-oss', 'extensions'),
    cacheDir: path.join(os.homedir(), 'Library', 'Application Support', 'VSCodium', 'CachedProfilesData')
  },
  {
    name: 'Windsurf',
    extDir: path.join(os.homedir(), '.windsurf', 'extensions'),
    cacheDir: path.join(os.homedir(), 'Library', 'Application Support', 'Windsurf', 'CachedProfilesData')
  },
  {
    name: 'Antigravity IDE',
    extDir: path.join(os.homedir(), '.antigravity-ide', 'extensions'),
    cacheDir: path.join(os.homedir(), 'Library', 'Application Support', 'Antigravity IDE', 'CachedProfilesData')
  },
  {
    name: 'Devin',
    extDir: path.join(os.homedir(), '.devin', 'extensions'),
    cacheDir: path.join(os.homedir(), 'Library', 'Application Support', 'Devin', 'CachedProfilesData')
  }
];

let failed = false;

function updateExtensionsJson(extDir, name) {
  const jsonPath = safeJoin(extDir, 'extensions.json');
  if (!fs.existsSync(jsonPath)) return;
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error(`❌ ${name}: failed to parse extensions.json: ${err.message}`);
    failed = true;
    return;
  }
  // Remove any stale entries for this extension (any version, any publisher id)
  const before = entries.length;
  entries = entries.filter(e => !(e.identifier && isZerotosaasThemeId(e.identifier.id)));
  const removed = before - entries.length;
  // Add the current version entry
  const locationPath = safeJoin(extDir, extDirName);
  entries.push({
    identifier: { id: extId },
    version,
    location: {
      $mid: 1,
      fsPath: locationPath,
      external: `file://${locationPath}`,
      path: locationPath,
      scheme: 'file'
    },
    relativeLocation: extDirName
  });
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(entries, null, 2), 'utf8');
    console.log(`📝 ${name}: extensions.json updated (removed ${removed} stale, added ${extDirName})`);
  } catch (err) {
    console.error(`❌ ${name}: failed to write extensions.json: ${err.message}`);
    failed = true;
  }
}

function clearCaches(cacheDir, name) {
  if (!fs.existsSync(cacheDir)) return;
  for (const profile of fs.readdirSync(cacheDir, { withFileTypes: true })) {
    if (!profile.isDirectory()) continue;
    for (const file of ['extensions.user.cache', 'extensions.builtin.cache']) {
      const filePath = safeJoin(cacheDir, profile.name, file);
      try {
        fs.rmSync(filePath, { force: true });
        console.log(`🧹 ${name}: cleared ${filePath}`);
      } catch (err) {
        console.error(`❌ ${name}: ${err.message}`);
        failed = true;
      }
    }
  }
}

for (const { name, extDir, cacheDir } of targets) {
  if (!fs.existsSync(extDir)) {
    console.log(`⏭  ${name}: extension directory not found, skipping`);
    continue;
  }

  for (const entry of fs.readdirSync(extDir, { withFileTypes: true })) {
    if (!isZerotosaasThemeDirName(entry.name)) continue;
    const entryPath = safeJoin(extDir, entry.name);
    try {
      fs.rmSync(entryPath, { recursive: true, force: true });
      console.log(`🗑  ${name}: removed ${entryPath}`);
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
      failed = true;
    }
  }

  const linkPath = safeJoin(extDir, extDirName);
  try {
    fs.symlinkSync(repoRoot, linkPath, 'dir');
    console.log(`✅ ${name}: ${linkPath} -> ${repoRoot}`);
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`);
    failed = true;
  }

  updateExtensionsJson(extDir, name);
  clearCaches(cacheDir, name);
}

if (failed) {
  process.exitCode = 1;
}
