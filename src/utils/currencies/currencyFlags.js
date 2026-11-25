// The flag of a currency's country, from country-flag-icons (SVG, MIT).
// Windows does not draw flag emoji, so pictures are used.
// Each flag is its own small file, loaded only when it is shown.
const FLAG_FILES = import.meta.glob("/node_modules/country-flag-icons/3x2/*.svg", {
  query: "?url",
  import: "default",
});

const loaders = Object.fromEntries(
  Object.entries(FLAG_FILES).map(([path, load]) => [path.slice(-6, -4), load]),
);

// the country of a currency: the first two letters of its code (SEK -> SE), EU for the euro.
// Codes of several countries or of none (XOF, XAF, XAU, ...) have no flag: null.
export const flagCountry = (code) => {
  if (!code || code.length !== 3) return null;
  const upper = code.toUpperCase();
  if (upper === "EUR") return "EU";
  if (upper.startsWith("X")) return null;
  return upper.slice(0, 2);
};

// a function that loads the flag's address, or null when there is no flag
export const flagLoader = (code) => loaders[flagCountry(code)] ?? null;
