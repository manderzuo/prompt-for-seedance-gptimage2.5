const assert = require('node:assert/strict');
const test = require('node:test');
const { buildProviderHeaders, ensureSessionId } = require('./opencode-compat.cjs');

test('OpenCode-compatible headers normalize the key and include client identity', () => {
  const headers = buildProviderHeaders('Bearer test-key', '  stable-session  ');
  assert.equal(headers.Authorization, 'Bearer test-key');
  assert.equal(headers['api-key'], 'test-key');
  assert.equal(headers['User-Agent'], 'gpt-image-2-prompt-optimizer/1.0');
  assert.equal(headers['x-opencode-session'], 'stable-session');
});

test('OpenCode session IDs remain stable when supplied and are generated when missing', () => {
  assert.equal(ensureSessionId('session-1'), 'session-1');
  const generated = ensureSessionId('');
  assert.match(generated, /^[0-9a-f-]{36}$/i);
});
