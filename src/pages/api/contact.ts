import type { APIRoute } from 'astro';

export const prerender = false;

// In-memory, best-effort rate limit (per serverless instance).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Origins allowed to post cross-origin (the static Pages build calls this
// endpoint from rakeemchapman.com while it runs on Vercel).
const ALLOWED_HOSTS = new Set([
  'rakeemchapman.com',
  'www.rakeemchapman.com',
  'rakeemchapman-site.vercel.app',
  'localhost',
  '127.0.0.1',
]);

const corsFor = (request: Request) => {
  const origin = request.headers.get('origin');
  try {
    if (origin && ALLOWED_HOSTS.has(new URL(origin).host)) {
      return {
        'access-control-allow-origin': origin,
        vary: 'origin',
      } as Record<string, string>;
    }
  } catch { /* fall through */ }
  return {} as Record<string, string>;
};

const ok = (cors: Record<string, string> = {}) =>
  new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', ...cors },
  });

const err = (status: number, msg = 'Something went wrong. Try again.', cors: Record<string, string> = {}) =>
  new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { 'content-type': 'application/json', ...cors },
  });

const seeOther = (origin: string, frag: string) =>
  new Response(null, { status: 303, headers: { location: `${origin}/${frag}` } });

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  // Origin check: refuse posts declaring an origin outside the allowlist.
  const origin = request.headers.get('origin');
  const cors = corsFor(request);
  const originHost = origin ? new URL(origin).host : url.host;
  if (originHost !== url.host && !ALLOWED_HOSTS.has(originHost)) return err(403);

  // Native form posts (no JS) get redirected back to the site they came from;
  // fetch posts get JSON.
  const html = !(request.headers.get('accept') ?? '').includes('application/json');
  const home = origin && ALLOWED_HOSTS.has(originHost) ? origin : url.origin;
  const done = () => (html ? seeOther(home, '#contact?sent=1') : ok(cors));
  const fail = (status: number, msg?: string) =>
    html ? seeOther(home, '#contact?err=1') : err(status, msg, cors);

  // Rate limit by IP.
  const ip = clientAddress ?? 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return fail(429, 'Too many messages. Try again later.');
  recent.push(now);
  hits.set(ip, recent);

  // Parse JSON or form-encoded bodies.
  let fields: Record<string, string>;
  try {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      fields = await request.json();
    } else {
      const fd = await request.formData();
      fields = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    }
  } catch {
    return fail(400);
  }

  const name = String(fields.name ?? '').trim().slice(0, 120);
  const email = String(fields.email ?? '').trim().slice(0, 200);
  const message = String(fields.message ?? '').trim().slice(0, 5000);
  // Honeypot: real users never see or fill this field.
  if (fields.website) return done();

  // Turnstile: required whenever the secret is configured (fails closed).
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = String(fields['cf-turnstile-response'] ?? '');
    if (!token || !(await verifyTurnstile(token, ip))) {
      return fail(400, 'Verification failed. Please try again.');
    }
  }

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return fail(400, 'Please fill in every field.');
  }

  const payload = {
    subject: `rakeemchapman.com contact — ${name}`,
    name,
    email,
    message,
    at: new Date().toISOString(),
  };

  try {
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? 'contact@rakeemchapman.com',
          to: [process.env.CONTACT_TO],
          reply_to: email,
          subject: payload.subject,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
      if (!res.ok) return fail(502);
    } else if (process.env.CONTACT_WEBHOOK_URL) {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return fail(502);
    } else {
      // No transport configured yet (local dev): log server-side only.
      console.log('[contact]', JSON.stringify(payload));
    }
  } catch {
    return fail(502);
  }

  return done();
};

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const OPTIONS: APIRoute = ({ request }) =>
  new Response(null, {
    status: 204,
    headers: {
      ...corsFor(request),
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'access-control-max-age': '86400',
    },
  });

export const ALL: APIRoute = () => err(405, 'Method not allowed.');
