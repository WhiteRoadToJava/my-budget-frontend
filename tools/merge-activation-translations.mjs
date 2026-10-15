// Run from the frontend project root:  node tools/merge-activation-translations.mjs
// Adds the "activation" section and two "login" keys to en / ar / sv translation.json.
// It edits the text in place (no re-formatting of the rest of the file) and is safe to run twice.
import { readFileSync, writeFileSync } from "node:fs";

const additions = JSON.parse(
  readFileSync(new URL("./activation-translations.json", import.meta.url), "utf8"),
);

for (const [lang, extra] of Object.entries(additions)) {
  const file = `src/locales/${lang}/translation.json`;
  let text = readFileSync(file, "utf8");
  const data = JSON.parse(text); // fail early if the file is already broken

  // 1) new top-level "activation" section, right after the opening brace
  if (!data.activation) {
    const body = JSON.stringify(extra.activation, null, 2).replace(/\n/g, "\n  ");
    text = text.replace(/^\{\r?\n/, (open) => `${open}  "activation": ${body},\n`);
  }

  // 2) extra keys inside "login" (a flat object, so its first "\n  }" closes it)
  const missing = Object.entries(extra.login).filter(([key]) => !(key in data.login));
  if (missing.length > 0) {
    const start = text.indexOf('"login": {');
    const end = text.indexOf("\n  }", start);
    let head = text.slice(0, end).trimEnd();
    if (!head.endsWith(",")) head += ",";
    const lines = missing.map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
    text = `${head}\n${lines.join(",\n")}${text.slice(end)}`;
  }

  JSON.parse(text); // never write a broken file
  writeFileSync(file, text, "utf8");
  console.log(`updated ${file}`);
}
