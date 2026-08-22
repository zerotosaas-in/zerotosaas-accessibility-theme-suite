const fs = require('fs');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const version = pkg.version;
const extId = `${pkg.publisher}.${pkg.name}`;
const extDirName = `${extId}-${version}`;

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
  }
];

let failed = false;

function clearCaches(cacheDir, name) {
  if (!fs.existsSync(cacheDir)) return;
  for (const profile of fs.readdirSync(cacheDir, { withFileTypes: true })) {
    if (!profile.isDirectory()) continue;
    for (const file of ['extensions.user.cache', 'extensions.builtin.cache']) {
      const filePath = path.join(cacheDir, profile.name, file);
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
    if (!entry.name.startsWith(`${extId}-`)) continue;
    const entryPath = path.join(extDir, entry.name);
    try {
      fs.rmSync(entryPath, { recursive: true, force: true });
      console.log(`🗑  ${name}: removed ${entryPath}`);
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
      failed = true;
    }
  }

  const linkPath = path.join(extDir, extDirName);
  try {
    fs.symlinkSync(repoRoot, linkPath, 'dir');
    console.log(`✅ ${name}: ${linkPath} -> ${repoRoot}`);
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`);
    failed = true;
  }

  clearCaches(cacheDir, name);
}

if (failed) {
  process.exitCode = 1;
}
