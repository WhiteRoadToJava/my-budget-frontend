import { describe, it, expect } from "vitest";
import { currencyName, currencyLabel, allCurrencyCodes, searchCurrencies, moveCode } from "../currencies/currencyNames";

describe("currency names", () => {
  it("names a currency in the language", () => {
    expect(currencyName("NOK", "en")).toBe("Norwegian Krone");
    expect(currencyName("SEK", "sv")).toMatch(/svensk krona/i);
    expect(currencyName("SAR", "ar")).toMatch(/ريال/);
  });

  it("puts the code before the name", () => {
    expect(currencyLabel("NOK", "en")).toBe("NOK — Norwegian Krone");
    expect(currencyLabel("", "en")).toBe("");
  });

  it("knows every ISO currency", () => {
    expect(allCurrencyCodes()).toEqual(expect.arrayContaining(["SEK", "NOK", "SYP", "KWD"]));
  });
});

describe("searchCurrencies", () => {
  const codes = ["DKK", "ISK", "NOK", "SEK", "USD", "KRW"];

  it("finds by code, those starting with the text first", () => {
    expect(searchCurrencies("no", "en", [], codes)).toEqual(["NOK"]);
    expect(searchCurrencies("k", "en", [], codes)[0]).toBe("KRW");
  });

  it("finds by name in the language, without accents or case", () => {
    expect(searchCurrencies("KRONE", "en", [], codes)).toEqual(expect.arrayContaining(["DKK", "NOK"]));
    expect(searchCurrencies("دولار", "ar", [], codes)).toEqual(["USD"]);
  });

  it("leaves out the ones already in the list, and an empty search finds nothing", () => {
    expect(searchCurrencies("nok", "en", ["NOK"], codes)).toEqual([]);
    expect(searchCurrencies("  ", "en", [], codes)).toEqual([]);
  });
});

describe("moveCode", () => {
  it("moves one code up or down", () => {
    expect(moveCode(["A", "B", "C"], "B", -1)).toEqual(["B", "A", "C"]);
    expect(moveCode(["A", "B", "C"], "B", 1)).toEqual(["A", "C", "B"]);
  });

  it("does nothing at the ends", () => {
    expect(moveCode(["A", "B"], "A", -1)).toEqual(["A", "B"]);
    expect(moveCode(["A", "B"], "B", 1)).toEqual(["A", "B"]);
  });
});