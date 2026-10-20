// Records which commit this deploy was built from, so /api/health can show it. Runs as part of the Netlify build.
import { writeFileSync } from "node:fs";
const commit = (process.env.COMMIT_REF || "").slice(0, 7);
writeFileSync(new URL("../lib/build.mjs", import.meta.url), `// Written by scripts/stamp.mjs at build time.\nexport const BUILD = ${JSON.stringify(commit)};\n`);
console.log(`stamped build ${commit || "(local)"}`);
