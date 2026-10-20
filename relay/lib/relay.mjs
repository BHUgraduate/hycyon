// Hycyon form relay: receives quote requests and contact messages from Hycyon's own websites and forwards them to a
// webhook (Discord by default). Zero dependencies. Uses web-standard Request/Response so the same code runs on
// Netlify Functions and under `node --test`.
//
// Nothing here is a secret. The webhook URL is read from environment variables only and is never logged or returned.

import { BUILD } from "./build.mjs";

export const DISCORD_LIMIT = 2000;
export const MAX_BODY = 10_000;
export const DEFAULT_ORIGINS = [
  "https://catalogue.hycyon.com",
  "https://portfolio.hycyon.com",
  "https://hycyon.com",
  "https://www.hycyon.com",
];

export const allowedOrigins = (env) =>
  env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_ORIGINS;

/* ------------------------------------------------------------------ validation */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HTTPS_URL = /^https:\/\/[^\s/]+\.[^\s/]+\S*$/;
// Strip control characters (including NUL) but keep ordinary newlines and tabs in free text.
const tidy = (v) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "");

const INTENTS = ["A product", "A website / platform", "A mobile app", "Something experimental", "A technical partner", "Collaboration"];

/** Each source is one of Hycyon's own forms. To add a form, add an entry here and a matching label in `title`. */
export const SOURCES = {
  catalogue: {
    title: "Catalogue quote request",
    fields: {
      name: { kind: "text", required: true, min: 2, max: 100, label: "Name", msg: "Please enter your name." },
      email: { kind: "email", required: true, label: "Email", msg: "Please enter a valid email address." },
      phone: { kind: "text", max: 40, label: "Phone / WhatsApp" },
      company: { kind: "text", max: 120, label: "Organisation" },
      service: { kind: "text", required: true, min: 2, max: 160, label: "Service", msg: "Please choose a service." },
      platform: { kind: "text", max: 200, label: "Platform" },
      budget: { kind: "text", required: true, min: 1, max: 80, label: "Budget", msg: "Please choose a budget range." },
      timeline: { kind: "text", required: true, min: 1, max: 80, label: "Timeline", msg: "Please choose a timeline." },
      addons: { kind: "text", max: 400, label: "Add-ons" },
      reference: { kind: "url", max: 300, label: "Reference", msg: "Enter a full link starting with https://, or leave it empty." },
      description: { kind: "text", required: true, min: 10, max: 2000, label: "Description", msg: "Add a few words about what the software should do." },
      acknowledged: { kind: "true", required: true, label: "Understands pricing is indicative", msg: "Please confirm you understand the pricing is indicative." },
    },
  },
  portfolio: {
    title: "Portfolio message",
    fields: {
      intent: { kind: "enum", values: INTENTS, required: true, label: "Working on", msg: "Pick what you are building first." },
      name: { kind: "text", required: true, min: 2, max: 100, label: "Name", msg: "Please enter your name." },
      email: { kind: "email", required: true, label: "Email", msg: "Please enter a valid email address." },
      message: { kind: "text", required: true, min: 10, max: 2000, label: "Message", msg: "Say a little about what you are working on." },
    },
  },
};

/** Returns { data, errors }. Unknown fields are ignored, so a client cannot smuggle extra content into the message. */
export function validate(source, body) {
  const spec = SOURCES[source].fields;
  const data = {};
  const errors = {};
  for (const [key, f] of Object.entries(spec)) {
    const raw = body[key];
    if (f.kind === "true") {
      if (raw === true) data[key] = true;
      else if (f.required) errors[key] = f.msg;
      continue;
    }
    const v = tidy(raw);
    if (!v) {
      if (f.required) errors[key] = f.msg || "Required.";
      continue;
    }
    if (f.max && v.length > f.max) errors[key] = `Please keep this under ${f.max} characters.`;
    else if (f.min && v.length < f.min) errors[key] = f.msg || "That is too short.";
    else if (f.kind === "email" && !EMAIL.test(v)) errors[key] = f.msg;
    else if (f.kind === "url" && !HTTPS_URL.test(v)) errors[key] = f.msg;
    else if (f.kind === "enum" && !f.values.includes(v)) errors[key] = f.msg;
    else data[key] = v;
  }
  return { data, errors };
}

/* ------------------------------------------------------------------ formatting */

export function summary(source, data) {
  const spec = SOURCES[source].fields;
  const lines = [];
  for (const [key, f] of Object.entries(spec)) {
    if (key === "description" || key === "message" || key === "acknowledged" || data[key] === undefined) continue;
    lines.push(`${f.label}: ${data[key]}`);
  }
  const long = data.description ?? data.message;
  if (long) lines.push("", long);
  return lines.join("\n");
}

/** Discord webhooks live at discord.com/api/webhooks/... and use their own message format. */
export function isDiscordWebhook(url) {
  try {
    const u = new URL(url);
    return /(^|\.)discord(app)?\.com$/i.test(u.hostname) || u.pathname.startsWith("/api/webhooks/");
  } catch {
    return false;
  }
}

/**
 * Discord refuses a message without `content`, caps it at 2000 characters, and would act on @everyone / @here typed
 * into a public form, so mentions are switched off. Link previews are suppressed by wrapping the one URL in < >.
 * Other webhooks receive the full payload unchanged.
 */
export function webhookBody(url, source, data, submittedAt) {
  const text = summary(source, data);
  if (!isDiscordWebhook(url)) return { kind: "lead", source, submittedAt, text, data };
  const safe = data.reference ? text.replace(`Reference: ${data.reference}`, `Reference: <${data.reference}>`) : text;
  const header = `**New ${SOURCES[source].title.toLowerCase()}**\n`;
  const note = "\n…(shortened to fit Discord)";
  const room = DISCORD_LIMIT - header.length;
  const body = safe.length > room ? safe.slice(0, room - note.length) + note : safe;
  return { username: "Hycyon website", content: (header + body).slice(0, DISCORD_LIMIT), allowed_mentions: { parse: [] } };
}

/* ------------------------------------------------------------------ plumbing */

export function createLimiter(windowMs, max) {
  const hits = new Map();
  return (ip) => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    return recent.length > max;
  };
}

const clientIp = (request) =>
  (request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

export const webhookFor = (env, source) =>
  env[`WEBHOOK_URL_${source.toUpperCase()}`] || env.DISCORD_WEBHOOK_URL || env.WEBHOOK_URL || "";

/** Builds the request handler. `env`, `fetchImpl` and `limiter` are injectable so it can be tested without a network. */
export function createRelay({ env = process.env, fetchImpl = fetch, limiter = createLimiter(10 * 60 * 1000, 5), now = () => new Date() } = {}) {
  return async function handle(request) {
    const origin = request.headers.get("origin");
    const allowed = origin && allowedOrigins(env).includes(origin);
    const cors = allowed
      ? { "Access-Control-Allow-Origin": origin, Vary: "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" }
      : { Vary: "Origin" };
    const reply = (body, status = 200) =>
      new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors } });

    if (request.method === "OPTIONS") return allowed ? reply(null, 204) : reply({ ok: false, code: "forbidden" }, 403);
    if (request.method !== "POST") return reply({ ok: false, code: "method_not_allowed" }, 405);
    // Browsers always send Origin on a cross-origin POST. Anything else (curl, scripts, other sites) is turned away.
    if (!allowed) return reply({ ok: false, code: "forbidden" }, 403);
    if (!request.headers.get("content-type")?.includes("application/json")) return reply({ ok: false, code: "bad_request" }, 415);

    const raw = await request.text();
    if (raw.length > MAX_BODY) return reply({ ok: false, code: "too_large" }, 413);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return reply({ ok: false, code: "bad_request" }, 400);
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) return reply({ ok: false, code: "bad_request" }, 400);

    if (limiter(clientIp(request))) return reply({ ok: false, code: "rate_limited" }, 429);

    // Honeypot: invisible to people, so anything in it is a bot. Pretend it worked.
    if (typeof body.website === "string" && body.website.length > 0) return reply({ ok: true });

    const source = typeof body.source === "string" && Object.hasOwn(SOURCES, body.source) ? body.source : null;
    if (!source) return reply({ ok: false, code: "invalid", fields: { source: "Unknown form." } }, 422);

    const { data, errors } = validate(source, body);
    if (Object.keys(errors).length) return reply({ ok: false, code: "invalid", fields: errors }, 422);

    const url = webhookFor(env, source);
    if (!url) return reply({ ok: false, code: "not_configured" }, 503);

    try {
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookBody(url, source, data, now().toISOString())),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        // Status and the service's short message are enough to diagnose; neither contains a secret. Never log the URL.
        const detail = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 160);
        console.error(`[relay:${source}] webhook responded ${res.status}${detail ? `: ${detail}` : ""}`);
        return reply({ ok: false, code: "delivery_failed" }, 502);
      }
      return reply({ ok: true });
    } catch (err) {
      console.error(`[relay:${source}] webhook request failed`, err instanceof Error ? err.name : "error");
      return reply({ ok: false, code: "delivery_failed" }, 502);
    }
  };
}

/** What the running server can see, as yes/no only. Never returns a URL or any secret. */
export function health(env = process.env) {
  const configured = Object.fromEntries(Object.keys(SOURCES).map((s) => [s, Boolean(webhookFor(env, s))]));
  const ok = Object.values(configured).every(Boolean);
  return new Response(
    JSON.stringify({
      ok: true,
      configured,
      build: BUILD || null,
      allowedOrigins: allowedOrigins(env),
      hint: ok ? "Every form has a webhook. Submissions will be forwarded." : "A form has no webhook. Set DISCORD_WEBHOOK_URL in Netlify for the Production context with the Functions and Runtime scopes, then redeploy.",
    }),
    { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
  );
}
