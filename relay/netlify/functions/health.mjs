import { health } from "../../lib/relay.mjs";

export default async () => health(process.env);

export const config = { path: "/api/health" };
