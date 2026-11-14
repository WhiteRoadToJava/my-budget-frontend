// Guards against raw keys like "debts.title" showing up in the UI:
// every key the code asks for must exist in all three languages.
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import en from "../en/translation.json";
import ar from "../ar/translation.json";
import sv from "../sv/translation.json";

const SRC = fileURLToPath(new URL("../..", import.meta.url));
const LANGUAGES = { en, ar, sv };

const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix + key;
    if (value && typeof value === "object") Object.assign(acc, flatten(value, `${path}.`));
    else acc[path] = value;
    return acc;
  }, {});

const sourceFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return name === "__tests__" || name === "locales" ? [] : sourceFiles(path);
    }
    return /\.(jsx?|tsx?)$/.test(name) ? [path] : [];
  });

// t("a.b"), i18n.t('a.b') and label: "a.b" (option lists)
const usedKeys = () => {
  const keys = new Set();
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/\bt\(\s*["'`]([A-Za-z0-9_.]+)["'`]/g)) keys.add(m[1]);
    for (const m of text.matchAll(/label:\s*"([a-zA-Z]+\.[A-Za-z0-9_.]+)"/g)) keys.add(m[1]);
  }
  return [...keys].sort();
};

describe("translations", () => {
  const keys = usedKeys();

  it("finds the keys used in the code", () => {
    expect(keys.length).toBeGreaterThan(100);
  });

  it.each(Object.keys(LANGUAGES))("%s has every key the code uses", (language) => {
    const flat = flatten(LANGUAGES[language]);
    const missing = keys.filter((key) => !(key in flat));
    expect(missing).toEqual([]);
  });

  it.each(Object.keys(LANGUAGES))("%s has no empty texts", (language) => {
    const empty = Object.entries(flatten(LANGUAGES[language]))
      .filter(([, value]) => typeof value === "string" && value.trim() === "")
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });
});
