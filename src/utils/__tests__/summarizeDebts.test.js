import { describe, it, expect } from "vitest";
import { summarizeDebts, sortDebts, filterDebts, isSettled } from "../debts/summarizeDebts";

const debt = (name, direction, currency, totalOwed) => ({
  id: name, name, direction, currency, summary: { totalOwed },
});

const debts = [
  debt("Car loan", "OWED_BY_ME", "SEK", 12000),
  debt("Ali", "OWED_TO_ME", "SEK", 500.5),
  debt("Old loan", "OWED_BY_ME", "SEK", 0),
  debt("Uncle", "OWED_BY_ME", "USD", 300.1),
  debt("Uncle 2", "OWED_BY_ME", "USD", 0.2),
];

describe("summarizeDebts", () => {
  it("adds remaining amounts per currency and direction", () => {
    const [sek, usd] = summarizeDebts(debts);
    expect(sek).toEqual({ currency: "SEK", owedByMe: 12000, owedToMe: 500.5, net: -11499.5, open: 2 });
    expect(usd).toEqual({ currency: "USD", owedByMe: 300.3, owedToMe: 0, net: -300.3, open: 2 });
  });

  it("returns nothing for no debts", () => {
    expect(summarizeDebts([])).toEqual([]);
    expect(summarizeDebts(undefined)).toEqual([]);
  });

  it("treats a missing summary as zero", () => {
    expect(summarizeDebts([{ direction: "OWED_TO_ME", currency: "EUR" }])[0].owedToMe).toBe(0);
  });
});

describe("sortDebts", () => {
  it("puts open debts first by remaining, settled last", () => {
    expect(sortDebts(debts).map((d) => d.name)).toEqual([
      "Car loan", "Ali", "Uncle", "Uncle 2", "Old loan",
    ]);
  });

  it("does not change the original array", () => {
    const copy = [...debts];
    sortDebts(debts);
    expect(debts).toEqual(copy);
  });
});

describe("filterDebts", () => {
  it("filters by direction", () => {
    expect(filterDebts(debts, "OWED_TO_ME").map((d) => d.name)).toEqual(["Ali"]);
    expect(filterDebts(debts, "ALL")).toHaveLength(5);
  });
});

describe("isSettled", () => {
  it("is true only when nothing is left", () => {
    expect(isSettled(debts[2])).toBe(true);
    expect(isSettled(debts[0])).toBe(false);
  });
});
