#!/usr/bin/env node
/**
 * Heuristik: ambil string ASCII dari file .riv (mirip `strings`) lalu filter
 * kata yang sering dipakai untuk trigger / nama ViewModel. Bukan API resmi Rive.
 *
 * Usage:
 *   node scripts/rive-strings-hints.mjs assets/rive/Tree22.riv
 */

import fs from 'node:fs';
import path from 'node:path';

const rivPath = process.argv[2];
if (!rivPath) {
  console.error('Usage: node scripts/rive-strings-hints.mjs <path-to-file.riv>');
  process.exit(1);
}

const abs = path.resolve(process.cwd(), rivPath);
if (!fs.existsSync(abs)) {
  console.error('File not found:', abs);
  process.exit(1);
}

const buf = fs.readFileSync(abs);
const chunks = new Set();
let cur = '';
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  if (b >= 32 && b <= 126) {
    cur += String.fromCharCode(b);
  } else {
    if (cur.length >= 4) chunks.add(cur);
    cur = '';
  }
}
if (cur.length >= 4) chunks.add(cur);

const all = [...chunks].sort();

const triggerLike = all.filter(
  (s) =>
    /trigger/i.test(s) ||
    /^play[A-Z]/i.test(s) ||
    /^stop[A-Z]/i.test(s) ||
    /^fire[A-Z]/i.test(s)
);

const viewModelLike = all.filter((s) => /^ViewModel\d*$/i.test(s) || s === 'ViewModel1');

const inputLike = all.filter(
  (s) => /^Input[A-Za-z0-9_]+$/.test(s) || /InputValue/i.test(s)
);

console.log('--- File:', abs);
console.log('--- ViewModel-like names (heuristic) ---');
console.log(viewModelLike.length ? viewModelLike.join('\n') : '(none)');
console.log('\n--- Trigger / play / stop-like strings (heuristic) ---');
console.log(triggerLike.length ? triggerLike.join('\n') : '(none)');
console.log('\n--- Input* / InputValue* strings (heuristic) ---');
console.log(inputLike.length ? [...new Set(inputLike)].sort().join('\n') : '(none)');
console.log('\n(Tip: sumber kebenaran tetap Rive Editor → Data / ViewModel panel.)');
