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

## Develop
```
cd relay
npm test        # 26 tests, no dependencies, no network
```
To add a form, add an entry to `SOURCES` in `lib/relay.mjs` (its fields and a title), add tests, and have the site post `{ source: "<name>", ...fields, website: "" }` to `/api/lead`.
