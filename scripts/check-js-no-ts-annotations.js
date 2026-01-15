#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.js', '.mjs', '.cjs'];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build'];
const ignoreFiles = ['scripts/check-js-no-ts-annotations.js'];

function walk(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (ignoreDirs.includes(name)) continue;
      res.push(...walk(full));
    } else if (stat.isFile()) {
      if (exts.includes(path.extname(name))) res.push(full);
    }
  }
  return res;
}

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Heuristics to detect TypeScript-style annotations in JS files (narrow checks to reduce false positives)
  // 1) explicit : any
  const anyPattern = /:\s*any\b/;
  // 2) generic type usage like `: Foo<` after a colon
  const genericTypePattern = /:\s*[A-Za-z_$][A-Za-z0-9_$]*\s*</;
  // 3) import/export type statements
  const importExportTypePattern = /\bexport\s+type\b|\bimport\s+type\b/;

  if (anyPattern.test(content)) return 'any';
  if (genericTypePattern.test(content)) return 'generic';
  if (importExportTypePattern.test(content)) return 'impExp';
  return false;
}

const files = walk(root);
const offenders = [];
for (const f of files) {
  try {
    const rel = path.relative(root, f);
    if (ignoreFiles.includes(rel)) continue;
    const reason = checkFile(f);
    if (reason) offenders.push({ file: f, reason });
  } catch (err) {
    // ignore read errors
  }
}

if (offenders.length) {
  console.error('Type annotations found in .js files (not allowed):');
  offenders.forEach((o) =>
    console.error('  ' + path.relative(root, o.file) + '  [' + o.reason + ']')
  );
  process.exit(1);
} else {
  console.log('No TypeScript-style annotations found in .js files.');
  process.exit(0);
}
