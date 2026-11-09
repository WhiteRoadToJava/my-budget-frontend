import { describe, it, expect } from "vitest";
import {
  pocketsOf, firstCurrency, pocketOf, hasCurrency, transactionCurrency,
  changeSinceOpeningOf, chosenCurrency, currenciesToAdd,
} from "../accounts/pockets";

const multi = {
  id: "a", currency: "SYP", totalBalance: 1500000,
  balances: [
    { currency: "SYP", openingBalance: 0, totalBalance: 1500000 },
    { currency: "USD", openingBalance: 50, totalBalance: 300 },
  ],
};
const old = { id: "b", currency: "SEK", balance: 100, totalBalance: 250 };

describe("pockets", () => {
  it("reads the balances, or one pocket from the old fields", () => {
    expect(pocketsOf(multi).map((p) => p.currency)).toEqual(["SYP", "USD"]);
    expect(pocketsOf(old)).toEqual([{ currency: "SEK", openingBalance: 100, totalBalance: 250 }]);
    expect(pocketsOf(null)).toEqual([]);
  });

  it("finds a currency of the account", () => {
    expect(firstCurrency(multi)).toBe("SYP");
    expect(pocketOf(multi, "USD").totalBalance).toBe(300);
    expect(hasCurrency(multi, "EUR")).toBe(false);
    expect(changeSinceOpeningOf(pocketOf(multi, "USD"))).toBe(250);
  });

  it("keeps the currency from the address only when the account has it", () => {
    expect(chosenCurrency(multi, "usd")).toBe("USD");
    expect(chosenCurrency(multi, "EUR")).toBe("SYP");
    expect(chosenCurrency(multi, undefined)).toBe("SYP");
  });

  it("gives a row's currency, with the account's as fallback", () => {
    expect(transactionCurrency({ currency: "USD", sourceAccount: { currency: "SYP" } })).toBe("USD");
    expect(transactionCurrency({ sourceAccount: { currency: "SYP" } })).toBe("SYP");
  });

  it("offers only the currencies not in the account", () => {
    expect(currenciesToAdd(["SYP", "USD", "EUR"], multi)).toEqual(["EUR"]);
  });
});
