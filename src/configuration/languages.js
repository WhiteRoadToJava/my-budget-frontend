// The app's languages. Arabic is the main language: new visitors start in Arabic.
// Names are written in their own language, so everyone finds theirs.
export const LANGUAGES = [
  { code: "ar", native: "العربية", short: "ع", dir: "rtl" },
  { code: "en", native: "English", short: "EN", dir: "ltr" },
  { code: "sv", native: "Svenska", short: "SV", dir: "ltr" },
];

export const DEFAULT_LANGUAGE = "ar";

// the saved choice; "sw" was stored by an older version of the selector
export const storedLanguage = () => {
  try {
    const saved = localStorage.getItem("language");
    const code = saved === "sw" ? "sv" : saved;
    return LANGUAGES.some((l) => l.code === code) ? code : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const saveLanguage = (code) => {
  try {
    localStorage.setItem("language", code);
  } catch {
    // private mode: the choice lasts until the page is closed
  }
};
