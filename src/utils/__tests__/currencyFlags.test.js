import { describe, it, expect } from "vitest";
import { flagCountry } from "../currencies/currencyFlags";

describe("flagCountry", () => {
  it("takes the country from the code", () => {
    expect(flagCountry("SEK")).toBe("SE");
    expect(flagCountry("usd")).toBe("US");
    expect(flagCountry("SYP")).toBe("SY");
  });

  it("uses the EU flag for the euro", () => {
    expect(flagCountry("EUR")).toBe("EU");
  });

  it("has no flag for shared or special codes", () => {
    expect(flagCountry("XOF")).toBeNull();
    expect(flagCountry("XAU")).toBeNull();
    expect(flagCountry("")).toBeNull();
    expect(flagCountry(null)).toBeNull();
  });
});