import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

// Production requests are rate limited by IP at the Vercel edge.
const MAX_BODY_BYTES = 32 * 1024;
const PUBLIC_ORIGINS = new Set([
  'https://rakeemchapman.com',
  'https://www.rakeemchapman.com',
]);

const allowedOrigin = (origin: string, ownOrigin: string) =>
  origin === ownOrigin || PUBLIC_ORIGINS.has(origin);

const corsFor = (request: Request, url: URL): Record<string, string> => {
  const origin = request.headers.get('origin');
  return origin && allowedOrigin(origin, url.origin)
    ? { 'access-control-allow-origin': origin, vary: 'origin' }
    : { vary: 'origin' };
};

const ok = (cors: Record<string, string> = {}) =>
  new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...cors },
  });

const err = (status: number, msg = 'Something went wrong. Try again.', cors: Record<string, string> = {}) =>
  new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...cors },
  });

const seeOther = (origin: string, frag: string) =>
  new Response(null, { status: 303, headers: { location: `${origin}/${frag}` } });

export const POST: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get('origin');
  if (origin && !allowedOrigin(origin, url.origin)) return err(403);
  const cors = corsFor(request, url);
  const html = !(request.headers.get('accept') ?? '').includes('application/json');
  const home = origin ?? url.origin;
  const done = () => (html ? seeOther(home, '#contact?sent=1') : ok(cors));
  const fail = (status: number, msg?: string) =>
    html ? seeOther(home, '#contact?err=1') : err(status, msg, cors);

  const type = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (type !== 'application/json' && type !== 'application/x-www-form-urlencoded') return fail(415);
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return fail(413);
  let fields: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail(400);
    let bytes = 0;
    let body = '';
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); return fail(413); }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    const parsed = type === 'application/json' ? JSON.parse(body) : Object.fromEntries(new URLSearchParams(body));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400);
    fields = parsed;
  } catch {
    return fail(400);
  }

  const field = (key: string) => {
    const value = fields[key];
    return typeof value === 'string' ? value.trim() : '';
  };
  const name = field('name');
  const email = field('email');
  const message = field('message');
  // Honeypot: real users never see or fill this field.
  if (fields.website) return done();

  if (!name || name.length > 120 || email.length > 200 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(email) || message.length < 5 || message.length > 5000) {
    return fail(400, 'Check your name, email, and message and try again.');
  }

  const recipient = process.env.CONTACT_TO?.trim();
  const smtpUser = process.env.SMTP_USERNAME?.trim();
  const smtpPassword = process.env.SMTP_PASSWORD?.trim();
  const useSmtp = Boolean(recipient && smtpUser && smtpPassword);
  const useResend = process.env.RESEND_API_KEY && recipient;
  if (!useSmtp && !useResend && !process.env.CONTACT_WEBHOOK_URL) {
    return fail(503, 'The contact form is temporarily unavailable. Your message was not sent.');
  }
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = field('cf-turnstile-response');
    const hostname = new URL(home).hostname;
    if (!token || token.length > 2048 || !(await verifyTurnstile(token, hostname))) {
      return fail(400, 'Verification failed. Please try again.');
    }
  }

  const payload = {
    subject: `rakeemchapman.com contact — ${name.replace(/[\r\n]+/g, ' ')}`,
    name,
    email,
    message,
    at: new Date().toISOString(),
  };

  try {
    if (useSmtp) {
      const port = Number(process.env.SMTP_PORT || 587);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST?.trim() || 'smtp.protonmail.ch',
        port,
        secure: process.env.SMTP_SECURE?.trim().toLowerCase() === 'true' || port === 465,
        requireTLS: true,
        auth: { user: smtpUser, pass: smtpPassword },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
      });
      const result = await transport.sendMail({
        from: { name: 'Rakeem Chapman website', address: process.env.SMTP_FROM?.trim() || smtpUser! },
        to: { address: recipient!, name: '' },
        replyTo: { address: email, name: '' },
        subject: payload.subject,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
      if (result.accepted.length !== 1 || result.rejected.length > 0) return fail(502);
    } else if (useResend) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
        headers: {
          authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? 'contact@rakeemchapman.com',
          to: [recipient],
          reply_to: email,
          subject: payload.subject,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
      if (!res.ok) return fail(502);
    } else if (process.env.CONTACT_WEBHOOK_URL) {
      // Optional extras for receivers that need auth and/or a different shape:
      // CONTACT_WEBHOOK_AUTH   -> sent as `Authorization: Bearer <value>`
      // CONTACT_WEBHOOK_FIELDS -> JSON template; {{name}} {{email}} {{message}}
      //                           {{subject}} {{at}} placeholders are replaced
      //                           with the escaped values (supports nesting).
      const template = process.env.CONTACT_WEBHOOK_FIELDS;
      let body = JSON.stringify(payload);
      if (template) {
        body = template.replace(/\{\{(name|email|message|subject|at)\}\}/g, (m, key: string) =>
          JSON.stringify((payload as Record<string, string>)[key] ?? '').slice(1, -1),
        );
      }
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
        headers: {
          'content-type': 'application/json',
          ...(process.env.CONTACT_WEBHOOK_AUTH
            ? { authorization: `Bearer ${process.env.CONTACT_WEBHOOK_AUTH}` }
            : {}),
        },
        body,
      });
      if (!res.ok) return fail(502);
    } else {
      return fail(503);
    }
  } catch {
    return fail(502);
  }

  return done();
};

async function verifyTurnstile(token: string, hostname: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; hostname?: string; action?: string };
    return data.success === true && data.hostname === hostname && data.action === 'contact';
  } catch {
    return false;
  }
}

export const OPTIONS: APIRoute = ({ request, url }) =>
  new Response(null, {
    status: 204,
    headers: {
      ...corsFor(request, url),
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'access-control-max-age': '86400',
    },
  });

export const ALL: APIRoute = () => err(405, 'Method not allowed.');
