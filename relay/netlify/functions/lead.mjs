import { createRelay } from "../../lib/relay.mjs";

// One relay per warm instance, so the best-effort rate limiter keeps its memory between requests.
const relay = createRelay({ env: process.env });

export default async (request) => relay(request);

export const config = { path: "/api/lead" };
