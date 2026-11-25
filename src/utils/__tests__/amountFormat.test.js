import { describe, it, expect, afterEach } from "vitest";
import { configureAmounts, formatAmount, hasOwnSymbol, symbolOf } from "../currencies/amountFormat";

// Intl puts no-break spaces and, in Arabic, a direction mark: compare with plain spaces
const plain = (text) => text.replace(/[\u00a0\u202f]/g, " ").replace(/\u200f/g, "");
const codes = ["SEK", "EUR", "USD", "GBP", "SYP"];

describe("formatAmount", () => {
  afterEach(() => configureAmounts("CODE", []));

  it("shows the code by default", () => {
    expect(plain(formatAmount(1250.5, "SEK", { language: "sv" }))).toBe("1 250,50 SEK");
    expect(plain(formatAmount(-1250.5, "USD", { language: "en" }))).toBe("−1,250.50 USD");
  });

  it("shows the symbol when the user chose it", () => {
    const options = { display: "SYMBOL", codes };
    expect(plain(formatAmount(1250.5, "SEK", { ...options, language: "sv" }))).toBe("1 250,50 kr");
    expect(plain(formatAmount(1250.5, "EUR", { ...options, language: "en" }))).toBe("€1,250.50");
    expect(plain(formatAmount(1250.5, "SEK", { ...options, language: "ar" }))).toBe("1,250.50 kr");
  });

  it("keeps the code when two currencies share a symbol", () => {
    // GBP and SYP are both "£" in English
    expect(plain(formatAmount(10, "GBP", { display: "SYMBOL", codes, language: "en" }))).toBe("10.00 GBP");
    expect(plain(formatAmount(10, "SEK", { display: "SYMBOL", codes: [...codes, "NOK"], language: "en" })))
      .toBe("10.00 SEK");
  });

  it("keeps the code when the symbol is only the code", () => {
    expect(plain(formatAmount(10, "AED", { display: "SYMBOL", codes: ["AED"], language: "sv" }))).toBe("10,00 AED");
  });

  it("uses what UserLayout configured", () => {
    configureAmounts("SYMBOL", codes);
    expect(plain(formatAmount(5, "EUR", { language: "en" }))).toBe("€5.00");
    configureAmounts(null, codes);
    expect(plain(formatAmount(5, "EUR", { language: "en" }))).toBe("5.00 EUR");
  });

  it("copes with a missing amount or currency", () => {
    expect(plain(formatAmount(undefined, "SEK", { language: "en" }))).toBe("0.00 SEK");
    expect(plain(formatAmount(3, null, { language: "en" }))).toBe("3.00");
    expect(plain(formatAmount(3, "ZZZ", { display: "SYMBOL", codes, language: "en" }))).toBe("3.00 ZZZ");
  });
});

describe("symbols", () => {
  it("finds a currency's symbol", () => {
    expect(symbolOf("EUR", "en")).toBe("€");
    // an unknown code is its own "symbol", so it is shown as a code
    expect(symbolOf("ZZZ", "en")).toBe("ZZZ");
  });

  it("knows when a symbol is shared", () => {
    expect(hasOwnSymbol("EUR", "en", codes)).toBe(true);
    expect(hasOwnSymbol("GBP", "en", codes)).toBe(false);
    expect(hasOwnSymbol("GBP", "ar", codes)).toBe(true); // UK£ and £ in Arabic
  });
});
