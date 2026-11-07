import { describe, it, expect, beforeEach } from "vitest";
import { storedLanguage, saveLanguage, DEFAULT_LANGUAGE, LANGUAGES } from "../../configuration/languages";

// a tiny in-memory localStorage (tests run without a browser)
beforeEach(() => {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
  };
});

describe("languages", () => {
  it("starts in Arabic on a first visit", () => {
    expect(DEFAULT_LANGUAGE).toBe("ar");
    expect(storedLanguage()).toBe("ar");
  });

  it("keeps the user's choice", () => {
    saveLanguage("sv");
    expect(storedLanguage()).toBe("sv");
  });

  it("maps the old 'sw' value and ignores unknown codes", () => {
    localStorage.setItem("language", "sw");
    expect(storedLanguage()).toBe("sv");
    localStorage.setItem("language", "fr");
    expect(storedLanguage()).toBe("ar");
  });

  it("works without storage (private mode)", () => {
    globalThis.localStorage = undefined;
    expect(storedLanguage()).toBe("ar");
  });

  it("lists Arabic first, written in its own language", () => {
    expect(LANGUAGES[0]).toMatchObject({ code: "ar", native: "العربية", dir: "rtl" });
  });
});
