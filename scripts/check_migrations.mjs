#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const migrationsDir = path.resolve(new URL(import.meta.url).pathname, '../db/migrations');

function listSqlFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.sql')).map(f => ({ name: f, path: path.join(dir, f) }));
}

function parseDatePrefix(filename) {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})_/);
  return m ? m[1] : null;
}

try {
  const files = listSqlFiles(migrationsDir).sort((a,b) => a.name.localeCompare(b.name));
  if (files.length === 0) {
    console.error('No migration files found in db/migrations.');
    process.exit(2);
  }

  console.log('Found migration files:');
  files.forEach(f => console.log('- ' + f.name));

  // Check for date ordering
  let prev = null;
  for (const f of files) {
    const d = parseDatePrefix(f.name);
    if (!d) {
      console.warn(`Warning: migration file ${f.name} has no YYYY-MM-DD_ prefix.`);
      continue;
    }
    if (prev && d < prev) {
      console.error(`ERROR: Migration ${f.name} appears out of order (prefix ${d} < ${prev}).`);
      process.exit(3);
    }
    prev = d;
  }

  // Check RLS/policies presence
  const rlsFile = files.find(f => f.name.toLowerCase().includes('rls') || f.name.toLowerCase().includes('policies'));
  if (!rlsFile) {
    console.warn('Warning: no RLS/policies migration file detected.');
  } else {
    console.log(`RLS/policies migration detected: ${rlsFile.name}`);
  }

  console.log('Migration check completed successfully.');
  process.exit(0);
} catch (err) {
  console.error('Error running migration checks:', err);
  process.exit(1);
}
