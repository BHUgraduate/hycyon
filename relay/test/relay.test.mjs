import test from "node:test";
import assert from "node:assert/strict";
import { createRelay, createLimiter, health, webhookBody, DEFAULT_ORIGINS } from "../lib/relay.mjs";

const ORIGIN = "https://catalogue.hycyon.com";
const DISCORD = "https://discord.com/api/webhooks/123456789/SECRET-TOKEN-abc";
const quote = {
  source: "catalogue", name: "Ravi Kumar", email: "ravi@example.com", phone: "+91 98765 43210", company: "Kumar Traders",
  service: "Standard Web App (₹30,000 – ₹75,000)", platform: "Web", budget: "₹30,000 – ₹75,000", timeline: "1 to 2 months",
  addons: "SEO setup", reference: "https://example.com/inspiration", description: "A booking system for our workshop with customer logins.",
  acknowledged: true, website: "",
};
const contact = { source: "portfolio", intent: "A product", name: "Asha", email: "asha@example.com", message: "I would like to talk about a language-learning product." };

/** A relay wired to a recording fake webhook. */
function setup({ env = { DISCORD_WEBHOOK_URL: DISCORD }, respond = () => new Response(null, { status: 204 }), limit } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return respond(url, init); };
  const handle = createRelay({ env, fetchImpl, limiter: limit ?? createLimiter(60_000, 1000), now: () => new Date("2026-10-21T10:00:00Z") });
  const post = (body, { origin = ORIGIN, type = "application/json", raw = false, ip = "1.2.3.4" } = {}) =>
    handle(new Request("https://hycyon-forms.netlify.app/api/lead", {
      method: "POST", headers: { ...(origin ? { origin } : {}), "content-type": type, "x-nf-client-connection-ip": ip }, body: raw ? body : JSON.stringify(body),
    }));
  return { calls, handle, post };
}
const json = async (res) => res.json();

test("catalogue quote request is delivered to Discord in Discord's format", async () => {
  const { post, calls } = setup();
  const res = await post(quote);
  assert.equal(res.status, 200);
  assert.deepEqual(await json(res), { ok: true });
  assert.equal(calls.length, 1);
  const b = calls[0].body;
  assert.match(b.content, /^\*\*New catalogue quote request\*\*/);
  for (const piece of ["ravi@example.com", "Kumar Traders", "Standard Web App", "booking system"]) assert.ok(b.content.includes(piece), piece);
  assert.deepEqual(b.allowed_mentions, { parse: [] });
  assert.ok(b.content.length <= 2000);
});

test("portfolio message is delivered", async () => {
  const { post, calls } = setup();
  const res = await post(contact, { origin: "https://portfolio.hycyon.com" });
  assert.equal(res.status, 200);
  assert.match(calls[0].body.content, /New portfolio message/);
  assert.match(calls[0].body.content, /A product/);
});

test("@everyone / @here / role mentions typed into the form cannot ping the server", async () => {
  const { post, calls } = setup();
  await post({ ...quote, description: "Hello @everyone @here <@&123456> please call me about this project today." });
  assert.ok(calls[0].body.content.includes("@everyone"));
  assert.deepEqual(calls[0].body.allowed_mentions, { parse: [] });
});

test("the reference link is wrapped so Discord does not unfurl a preview", async () => {
  const { post, calls } = setup();
  await post(quote);
  assert.ok(calls[0].body.content.includes("Reference: <https://example.com/inspiration>"));
});

test("a worst-case submission is shortened to Discord's limit, not rejected", async () => {
  const { post, calls } = setup();
  const res = await post({ ...quote, description: "x".repeat(2000), platform: "p".repeat(200), addons: "a".repeat(400), company: "c".repeat(120) });
  assert.equal(res.status, 200);
  assert.ok(calls[0].body.content.length <= 2000);
  assert.match(calls[0].body.content, /shortened/);
});

test("a non-Discord webhook receives the full structured payload", async () => {
  const { post, calls } = setup({ env: { WEBHOOK_URL: "https://hooks.zapier.com/hooks/catch/1/abc" } });
  await post(quote);
  const b = calls[0].body;
  assert.equal(b.kind, "lead");
  assert.equal(b.source, "catalogue");
  assert.equal(b.submittedAt, "2026-10-21T10:00:00.000Z");
  assert.equal(b.data.email, "ravi@example.com");
  assert.equal(b.content, undefined);
});

test("per-form webhook overrides the default", async () => {
  const { post, calls } = setup({ env: { DISCORD_WEBHOOK_URL: DISCORD, WEBHOOK_URL_PORTFOLIO: "https://discord.com/api/webhooks/999/other" } });
  await post(contact, { origin: "https://portfolio.hycyon.com" });
  await post(quote);
  assert.equal(calls[0].url, "https://discord.com/api/webhooks/999/other");
  assert.equal(calls[1].url, DISCORD);
});

/* ---------- who may call it ---------- */

test("a request from another website is refused, and gets no CORS header", async () => {
  const { post, calls } = setup();
  const res = await post(quote, { origin: "https://evil.example" });
  assert.equal(res.status, 403);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
  assert.equal(calls.length, 0);
});

test("a request with no Origin (curl, scripts) is refused", async () => {
  const { post, calls } = setup();
  assert.equal((await post(quote, { origin: null })).status, 403);
  assert.equal(calls.length, 0);
});

test("lookalike origins are refused (exact match only)", async () => {
  const { post } = setup();
  for (const o of ["https://catalogue.hycyon.com.evil.example", "http://catalogue.hycyon.com", "https://evilcatalogue.hycyon.com", "https://catalogue.hycyon.com:8443"]) {
    assert.equal((await post(quote, { origin: o })).status, 403, o);
  }
});

test("allowed origins can be changed with ALLOWED_ORIGINS", async () => {
  const { post } = setup({ env: { DISCORD_WEBHOOK_URL: DISCORD, ALLOWED_ORIGINS: "https://forms-test.example" } });
  assert.equal((await post(quote)).status, 403);
  assert.equal((await post(quote, { origin: "https://forms-test.example" })).status, 200);
});

test("CORS preflight succeeds for Hycyon sites and fails for others", async () => {
  const { handle } = setup();
  const ok = await handle(new Request("https://x/api/lead", { method: "OPTIONS", headers: { origin: ORIGIN, "access-control-request-method": "POST" } }));
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get("access-control-allow-origin"), ORIGIN);
  assert.match(ok.headers.get("access-control-allow-methods"), /POST/);
  assert.equal(ok.headers.get("vary"), "Origin");
  const bad = await handle(new Request("https://x/api/lead", { method: "OPTIONS", headers: { origin: "https://evil.example" } }));
  assert.equal(bad.status, 403);
  assert.equal(bad.headers.get("access-control-allow-origin"), null);
});

test("successful and failed responses both carry CORS so the site can read them", async () => {
  const { post } = setup();
  const good = await post(quote);
  const bad = await post({ ...quote, email: "nope" });
  for (const r of [good, bad]) assert.equal(r.headers.get("access-control-allow-origin"), ORIGIN);
});

test("GET and other methods are not allowed", async () => {
  const { handle } = setup();
  assert.equal((await handle(new Request("https://x/api/lead", { method: "GET", headers: { origin: ORIGIN } }))).status, 405);
});

/* ---------- bad input ---------- */

test("validation errors name the field and nothing is forwarded", async () => {
  const { post, calls } = setup();
  const res = await post({ ...quote, name: "", email: "not-an-email", description: "short", acknowledged: false, reference: "http://insecure.example" });
  assert.equal(res.status, 422);
  const { fields, code } = await json(res);
  assert.equal(code, "invalid");
  for (const k of ["name", "email", "description", "acknowledged", "reference"]) assert.ok(fields[k], k);
  assert.equal(calls.length, 0);
});

test("unknown form and unknown intent are rejected", async () => {
  const { post } = setup();
  assert.equal((await post({ ...quote, source: "admin" })).status, 422);
  assert.equal((await post({ ...quote, source: "__proto__" })).status, 422);
  assert.equal((await post({ ...contact, intent: "Something else entirely" }, { origin: "https://portfolio.hycyon.com" })).status, 422);
});

test("extra fields a client invents are ignored, not forwarded", async () => {
  const { post, calls } = setup();
  await post({ ...quote, evil: "@everyone BUY NOW", content: "overridden", allowed_mentions: { parse: ["everyone"] } });
  assert.ok(!calls[0].body.content.includes("BUY NOW"));
  assert.deepEqual(calls[0].body.allowed_mentions, { parse: [] });
});

test("control characters are stripped and non-strings do not crash it", async () => {
  const { post, calls } = setup();
  const res = await post({ ...quote, name: "Ra\u0000vi\u0007 Kumar", phone: 12345, company: { a: 1 } });
  assert.equal(res.status, 200);
  assert.ok(calls[0].body.content.includes("Name: Ravi Kumar"));
});

test("wrong content type, malformed JSON, arrays and oversize bodies are refused", async () => {
  const { post } = setup();
  assert.equal((await post("x", { type: "text/plain", raw: true })).status, 415);
  assert.equal((await post("{bad", { raw: true })).status, 400);
  assert.equal((await post("[1,2]", { raw: true })).status, 400);
  assert.equal((await post("null", { raw: true })).status, 400);
  assert.equal((await post({ ...quote, description: "z".repeat(11_000) })).status, 413);
});

test("the honeypot answers success but forwards nothing", async () => {
  const { post, calls } = setup();
  const res = await post({ ...quote, website: "http://spam.example" });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("rate limit: 5 per window per visitor, others unaffected", async () => {
  const { post } = setup({ limit: createLimiter(60_000, 5) });
  const codes = [];
  for (let i = 0; i < 7; i++) codes.push((await post(quote, { ip: "9.9.9.9" })).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429]);
  assert.equal((await post(quote, { ip: "8.8.8.8" })).status, 200);
});

/* ---------- when the webhook misbehaves ---------- */

test("no webhook configured -> 503 not_configured", async () => {
  const { post } = setup({ env: {} });
  const res = await post(quote);
  assert.equal(res.status, 503);
  assert.equal((await json(res)).code, "not_configured");
});

test("the webhook refusing the message -> 502 and the reason is logged without the URL", async () => {
  const logs = [];
  const orig = console.error; console.error = (...a) => logs.push(a.join(" "));
  try {
    const { post } = setup({ respond: () => new Response(JSON.stringify({ message: "Cannot send an empty message", code: 50006 }), { status: 400 }) });
    const res = await post(quote);
    assert.equal(res.status, 502);
    assert.equal((await json(res)).code, "delivery_failed");
  } finally { console.error = orig; }
  assert.ok(logs.some((l) => /responded 400/.test(l) && /empty message/.test(l)));
  assert.ok(!logs.join("\n").includes("SECRET-TOKEN"), "the webhook URL must never be logged");
});

test("the webhook being unreachable -> 502 and never throws", async () => {
  const { post } = setup({ respond: () => { throw new TypeError("fetch failed"); } });
  assert.equal((await post(quote)).status, 502);
});

/* ---------- health & helpers ---------- */

test("health reports yes/no per form and never the webhook URL", async () => {
  const res = health({ DISCORD_WEBHOOK_URL: DISCORD });
  const text = await res.text();
  const body = JSON.parse(text);
  assert.deepEqual(body.configured, { catalogue: true, portfolio: true });
  assert.ok(!text.includes("SECRET-TOKEN") && !text.includes("discord.com"));
  const none = JSON.parse(await health({}).text());
  assert.deepEqual(none.configured, { catalogue: false, portfolio: false });
  assert.match(none.hint, /DISCORD_WEBHOOK_URL/);
  assert.deepEqual(JSON.parse(text).allowedOrigins, DEFAULT_ORIGINS);
});

test("webhookBody detects Discord by host or by the /api/webhooks/ path", () => {
  const d = { name: "A", email: "a@b.co", message: "ten chars!!" };
  assert.ok(webhookBody("https://discord.com/api/webhooks/1/x", "portfolio", { ...d, intent: "A product" }, "t").content);
  assert.ok(webhookBody("https://discordapp.com/api/webhooks/1/x", "portfolio", { ...d, intent: "A product" }, "t").content);
  assert.ok(webhookBody("http://localhost:9/api/webhooks/1/x", "portfolio", { ...d, intent: "A product" }, "t").content);
  assert.equal(webhookBody("https://hooks.slack.com/services/T/B/x", "portfolio", { ...d, intent: "A product" }, "t").kind, "lead");
});
