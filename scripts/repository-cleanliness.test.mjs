import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const testFile = 'scripts/repository-cleanliness.test.mjs';
const binaryPattern = /\.(?:gif|ico|jpe?g|png|svg|webp)$/i;
const checks = [
  { name: 'hard-coded protocol address', pattern: /(?:https?:\/\/|www\.)/i },
  { name: 'inherited copyright identity', pattern: /Copyright\s+\(c\)\s+\d{4}\s+\S+/i }
];

function trackedTextFiles() {
  return execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter((file) => file && file !== 'package-lock.json' && file !== testFile && !binaryPattern.test(file));
}

test('runtime source and documentation contain no inherited addresses or copyright identity', () => {
  const violations = [];

  for (const file of trackedTextFiles()) {
    const text = readFileSync(file, 'utf8');
    for (const check of checks) {
      if (check.pattern.test(text)) violations.push(`${file}: ${check.name}`);
    }
  }

  assert.deepEqual(violations, []);
});
