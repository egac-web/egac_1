import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), 'egac_1', '.env');
try {
  const envRaw = fs.readFileSync(envPath, 'utf8');
  envRaw.split(/\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
} catch (err) {
  console.error('Could not read .env:', err);
  process.exit(1);
}

(async () => {
  try {
    await import('./create_test_invite.mjs');
  } catch (err) {
    console.error('Error running create_test_invite:', err);
    process.exit(1);
  }
})();
