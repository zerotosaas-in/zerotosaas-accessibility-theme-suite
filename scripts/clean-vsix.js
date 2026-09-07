const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const currentPrefix = `${pkg.name}-${pkg.version}`;

let removed = 0;

for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (!entry.name.startsWith(`${pkg.name}-`) || !entry.name.endsWith('.vsix')) continue;
  if (entry.name.startsWith(`${currentPrefix}-`) || entry.name === `${currentPrefix}.vsix`) continue;

  const filePath = path.join(repoRoot, entry.name);
  try {
    fs.rmSync(filePath, { force: true });
    console.log(`🗑  removed stale VSIX: ${filePath}`);
    removed++;
  } catch (err) {
    console.error(`❌ failed to remove ${filePath}: ${err.message}`);
    process.exitCode = 1;
  }
}

if (removed === 0) {
  console.log(`✅ no stale VSIX artifacts (current: ${currentPrefix}.vsix)`);
}
