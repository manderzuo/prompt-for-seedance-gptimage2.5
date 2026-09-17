import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const payloadFiles = ['cases.json', 'data/cases.json'];
const externalLinkPattern = /(?:https?:\/\/|www\.)\S+/i;

function findExternalLinks(value, path = '$', matches = []) {
  if (typeof value === 'string') {
    if (externalLinkPattern.test(value)) matches.push(`${path}: ${value.match(externalLinkPattern)[0]}`);
    return matches;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => findExternalLinks(item, `${path}[${index}]`, matches));
    return matches;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => findExternalLinks(item, `${path}.${key}`, matches));
  }

  return matches;
}

test('generated case payloads contain no external links', () => {
  const matches = payloadFiles.flatMap((file) => {
    const payload = JSON.parse(readFileSync(file, 'utf8'));
    return findExternalLinks(payload, file);
  });

  assert.deepEqual(matches, []);
});
