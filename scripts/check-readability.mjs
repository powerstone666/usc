// Fails if any public-facing component or page uses text smaller than 14px.
// Usage: npm run check:ui   (optionally: node scripts/check-readability.mjs <dir>)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? "app";
const SMALL_TEXT = /\btext-xs\b|\btext-\[(?:[0-9]|1[0-3])(?:\.\d+)?px\]/;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name !== "admin" && name !== "node_modules") yield* files(path);
    } else if (path.endsWith(".tsx")) {
      yield path;
    }
  }
}

const hits = [];
for (const file of files(root)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (SMALL_TEXT.test(line)) hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
    });
}

if (hits.length) {
  console.error(`Text under 14px found (use text-sm or larger):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("check:ui ok — no text under 14px outside /admin");
