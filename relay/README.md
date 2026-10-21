# Hycyon form relay

A small service that receives form submissions from Hycyon's own websites and passes them to Discord.

| Form | Site | Sends |
|---|---|---|
| `catalogue` | catalogue.hycyon.com quote form | A project quote request |
| `portfolio` | portfolio.hycyon.com contact form | A message from the portfolio |

Why it exists: those sites are static pages, so they cannot hold a webhook URL (anything in a page is public, and a leaked Discord webhook can be spammed or deleted). The relay holds the URL on a server and accepts only what Hycyon's own forms send.

## How it behaves
- **Only Hycyon's sites can use it.** A request must come from an allowed origin (browsers always send one). Anything else gets a 403 and no CORS headers.
- **Validated again on the server.** Each form has a schema in `lib/relay.mjs`. Unknown fields are ignored, control characters are stripped, and bodies over 10 KB are refused.
- **Spam:** an invisible honeypot field (a bot that fills it is told "success" and nothing is forwarded), plus a best-effort rate limit of 5 per 10 minutes per visitor.
- **Discord safety:** mentions are switched off (so `@everyone` typed into a form cannot ping the server), links are wrapped so Discord does not unfurl a preview, and messages are trimmed to Discord's 2000-character limit.
- **Never loses a request:** if the relay is down or refuses, the websites fall back to opening an email draft, as they did before.
- **Nothing secret is logged or returned.** When Discord refuses a message, the log says the status and Discord's short reason, never the URL. `GET /api/health` says yes or no per form, never the URL.
- Other webhook types (Zapier, Make, Slack, Apps Script) receive the full JSON payload instead of a Discord message.

## Environment variables (Netlify → Site configuration → Environment variables)
| Variable | Required | Meaning |
|---|---|---|
| `DISCORD_WEBHOOK_URL` | Yes | The Discord webhook that receives every form |
| `WEBHOOK_URL_CATALOGUE`, `WEBHOOK_URL_PORTFOLIO` | No | Send one form to a different channel |
| `ALLOWED_ORIGINS` | No | Comma-separated list. Default: catalogue, portfolio, hycyon.com and www.hycyon.com |

Set them for the **Production** context, with the **Functions** and **Runtime** scopes, and redeploy after any change. Never commit a webhook URL.

## Deploy
Create a Netlify site from the `hycyon` repository with **Base directory** `relay` and **Production branch** `main`. The build settings come from `relay/netlify.toml`. Netlify skips the build when nothing in `relay/` changed.

After deploying, open `https://<your-site>.netlify.app/api/health`. It should show `"catalogue": true` and `"portfolio": true`, and `build` should match the latest commit.

The websites call `https://hycyon-forms.netlify.app/api/lead`. If you name the Netlify site differently, update `formsEndpoint` in the catalogue (`src/shared/data/site.js`) and `FORMS_ENDPOINT` in the portfolio (`assets/js/contact.js`).

## When a form says "We couldn't send it online just now"
The website shows a short reason in brackets. The relay also logs every outcome (Netlify → Logs & metrics → Functions → `lead`; the log view shows only new lines while open, so set it to a time range or send a test while watching). Logs never contain a visitor's details or the webhook URL.

| Reason on the page | What it means | Relay log line | Fix |
|---|---|---|---|
| `delivery_failed` | The relay got it but Discord refused it | `webhook responded 404: Unknown Webhook` (or 401, 400) | Re-copy the webhook URL from Discord and set it again; redeploy |
| `not_configured` | No webhook is set | `no webhook is configured for this form` | Set `DISCORD_WEBHOOK_URL` (Production, Functions and Runtime scopes); redeploy |
| `invalid` | A field failed the relay's checks | `refused: invalid fields: name, email` | Fix the form or the relay's rules |
| `rate_limited` | Too many sends from one visitor | `rate limit reached` | Wait ten minutes |
| `network` | The browser could not complete the request. **Either the relay is unreachable, or the relay refused the page's origin**: browsers hide that reply, so both look the same | **Origin refused:** `refused request from origin "..."`. **Unreachable:** no line at all | If a refused-origin line appears, add that origin to `ALLOWED_ORIGINS`. If no line appears, check `/api/health` and the Netlify deploy |
| `timeout` | No answer within 8 seconds | none | Check Netlify status; try again |
| `http_404` etc. | An unexpected status | none | Check the endpoint address in the site |

## Develop
```
cd relay
npm test        # 28 tests, no dependencies, no network
```
To add a form, add an entry to `SOURCES` in `lib/relay.mjs` (its fields and a title), add tests, and have the site post `{ source: "<name>", ...fields, website: "" }` to `/api/lead`.
