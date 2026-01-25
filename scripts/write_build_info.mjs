import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outPath = path.resolve('src/lib/buildInfo.json');
let sha = process.env.BUILD_SHA || '';
try {
  if (!sha) sha = execSync('git rev-parse HEAD').toString().trim();
} catch (err) {
  // fallback to short timestamp
  sha = process.env.GITHUB_SHA || '';
}
const info = { sha, built_at: new Date().toISOString() };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(info, null, 2), 'utf8');
console.log('Wrote buildInfo:', info);
