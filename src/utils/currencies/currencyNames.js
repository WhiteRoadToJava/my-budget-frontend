// Names of currencies, and the list of every currency, from the browser itself
// (Intl), so no list or translation is written by hand.

const namesCache = {};

// "NOK" -> "Norwegian Krone" / "كرونة نرويجية" / "norsk krona"; the code when unknown
export const currencyName = (code, language = "en") => {
  if (!code) return "";
  try {
    namesCache[language] ??= new Intl.DisplayNames([language], { type: "currency" });
    return namesCache[language].of(code) ?? code;
  } catch {
    return code;
  }
};

// "SEK — Swedish Krona"
export const currencyLabel = (code, language) => {
  const name = currencyName(code, language);
  return name && name !== code ? `${code} — ${name}` : code;
};

// every ISO currency the browser knows (about 300); empty in a very old browser
export const allCurrencyCodes = () => {
  try {
    return Intl.supportedValuesOf("currency");
  } catch {
    return [];
  }
};

// lower case, without accents and Arabic diacritics, so "KRONA", "krona" and "króna" match
const plain = (text) =>
  String(text ?? "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "");

// the currencies whose code or name (in the language) holds the text, codes that start
// with it first; the ones in `exclude` (already in the list) are left out
export const searchCurrencies = (query, language, exclude = [], codes = allCurrencyCodes(), limit = 20) => {
  const text = plain(query).trim();
  if (!text) return [];
  const skip = new Set(exclude);
  const found = [];
  for (const code of codes) {
    if (skip.has(code)) continue;
    const byCode = plain(code).startsWith(text);
    if (byCode || plain(currencyName(code, language)).includes(text)) found.push({ code, byCode });
  }
  found.sort((a, b) => Number(b.byCode) - Number(a.byCode) || a.code.localeCompare(b.code));
  return found.slice(0, limit).map((f) => f.code);
};

// the codes with one moved up (-1) or down (+1); unchanged at the ends
export const moveCode = (codes, code, step) => {
  const from = codes.indexOf(code);
  const to = from + step;
  if (from < 0 || to < 0 || to >= codes.length) return codes;
  const moved = [...codes];
  [moved[from], moved[to]] = [moved[to], moved[from]];
  return moved;
};