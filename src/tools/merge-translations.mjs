// Run from the frontend project root:
//   node tools/merge-translations.mjs tools/reset-translations.json
// The JSON file looks like { "en": { "section": { "key": "text" } }, "ar": {...}, "sv": {...} }.
// - a section that does not exist yet is added as a new block
// - a section that exists only gets its missing keys (existing texts are never changed)
// The files are edited as text, so the rest of each translation.json is not re-formatted.
// Safe to run twice.
import { readFileSync, writeFileSync } from "node:fs";

const source = process.argv[2];
if (!source) {
  console.error("usage: node tools/merge-translations.mjs <additions.json>");
  process.exit(1);
}
const additions = JSON.parse(readFileSync(source, "utf8"));

for (const [lang, sections] of Object.entries(additions)) {
  const file = `src/locales/${lang}/translation.json`;
  let text = readFileSync(file, "utf8");
  const data = JSON.parse(text); // fail early if the file is already broken

  for (const [section, entries] of Object.entries(sections)) {
    if (!data[section]) {
      // new top-level section, right after the opening brace
      const body = JSON.stringify(entries, null, 2).replace(/\n/g, "\n  ");
      text = text.replace(/^\{\r?\n/, (open) => `${open}  ${JSON.stringify(section)}: ${body},\n`);
      continue;
    }

    // existing section (flat object): add only the missing keys before its closing brace
    const missing = Object.entries(entries).filter(([key]) => !(key in data[section]));
    if (missing.length === 0) continue;

    const start = text.indexOf(`${JSON.stringify(section)}: {`);
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
