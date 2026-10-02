const { randomUUID } = require('node:crypto');

const clientUserAgent = 'gpt-image-2-prompt-optimizer/1.0';

function ensureSessionId(sessionId) {
  const normalized = String(sessionId || '').trim();
  return normalized || randomUUID();
}

function buildProviderHeaders(apiKey, sessionId) {
  const normalizedApiKey = String(apiKey || '').replace(/^Bearer\s+/i, '').trim();
  return {
    // Authorization is the OpenAI-compatible standard. api-key also covers
    // compatible gateways that copy Azure-style authentication semantics.
    Authorization: `Bearer ${normalizedApiKey}`,
    'api-key': normalizedApiKey,
    // OpenCode Go requires a client identity and a stable session identifier.
    'User-Agent': clientUserAgent,
    'x-opencode-session': ensureSessionId(sessionId),
  };
}

module.exports = { buildProviderHeaders, ensureSessionId };
