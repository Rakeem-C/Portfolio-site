import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POST, OPTIONS } from '../src/pages/api/contact.ts';

const url = new URL('https://api.example.test/api/contact');
const origin = 'https://rakeemchapman.com';
const message = JSON.stringify({ name: 'Test Person', email: 'test@example.test', message: 'Synthetic test message' });

function submit(body, requestOrigin = origin) {
  const request = new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', origin: requestOrigin },
    body,
  });
  return POST({ request, url });
}

test('the contact endpoint rejects bad requests and reports actual transport outcomes', async (t) => {
  for (const key of ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_WEBHOOK_URL', 'CONTACT_WEBHOOK_AUTH', 'CONTACT_WEBHOOK_FIELDS', 'TURNSTILE_SECRET_KEY']) {
    const previous = process.env[key];
    delete process.env[key];
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }

  const preflight = await OPTIONS({ request: new Request(url, { method: 'OPTIONS', headers: { origin } }), url });
  assert.equal(preflight.headers.get('access-control-allow-origin'), origin);
  assert.equal((await submit(message, 'http://rakeemchapman.com')).status, 403);
  assert.equal((await submit('null')).status, 400);
  assert.equal((await submit('a'.repeat(32769))).status, 413);
  const unavailable = await submit(message);
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).ok, false);

  process.env.CONTACT_WEBHOOK_URL = 'https://receiver.example.test/contact';
  const send = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 204 }));
  assert.equal((await submit(message)).status, 200);
  assert.equal(send.mock.callCount(), 1);
  assert.equal(JSON.parse(send.mock.calls[0].arguments[1].body).email, 'test@example.test');

  send.mock.mockImplementation(async () => new Response(null, { status: 500 }));
  assert.equal((await submit(message)).status, 502);

  process.env.TURNSTILE_SECRET_KEY = 'synthetic';
  assert.equal((await submit(message)).status, 400);
  assert.equal(send.mock.callCount(), 2);
});
