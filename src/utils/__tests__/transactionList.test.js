import { describe, it, expect } from "vitest";
import {
  isIncoming, signedAmount, groupByMonth, filterTransactions, otherAccountName,
} from "../transactions/transactionList";

const t = (id, type, amount, createdAt, extra = {}) => ({ id, type, amount, createdAt, ...extra });
const list = [
  t("1", "incomse", 1000, "2026-10-01T09:00:00", { category: "1", description: "October salary" }),
  t("2", "expense", 200.1, "2026-10-15T12:00:00", { category: "3" }),
  t("3", "out-transfer", 50, "2026-11-02T08:00:00", { destinationAccount: { name: "Savings" } }),
  t("4", "debt-in", 300, "2026-11-01T10:00:00", { category: "Debt" }),
  t("5", "expense", 40, "2026-11-01T11:00:00", { category: "Debt" }),
];

describe("direction", () => {
  it("knows what brings money in", () => {
    expect(["incomse", "in-transfer", "debt-in"].every((type) => isIncoming({ type }))).toBe(true);
    expect(isIncoming({ type: "out-transfer" })).toBe(false);
    expect(signedAmount(list[1])).toBe(-200.1);
    expect(signedAmount(list[3])).toBe(300);
  });
});

describe("groupByMonth", () => {
  it("groups newest first with money in and out per month", () => {
    const groups = groupByMonth(list);
    expect(groups.map((g) => g.key)).toEqual(["2026-11", "2026-10"]);
    expect(groups[0].items.map((x) => x.id)).toEqual(["3", "5", "4"]);
    expect(groups[0]).toMatchObject({ totalIn: 300, totalOut: 90 });
    expect(groups[1]).toMatchObject({ totalIn: 1000, totalOut: 200.1 });
  });

  it("does not change the input", () => {
    const copy = [...list];
    groupByMonth(list);
    expect(list).toEqual(copy);
  });
});

describe("filterTransactions", () => {
  it("filters by type", () => {
    expect(filterTransactions(list, { type: "expense" }).map((x) => x.id)).toEqual(["2", "5"]);
    expect(filterTransactions(list, { type: "debt" }).map((x) => x.id)).toEqual(["4", "5"]);
    expect(filterTransactions(list, { type: "transfer" }).map((x) => x.id)).toEqual(["3"]);
  });

  it("searches description, category name and accounts", () => {
    expect(filterTransactions(list, { query: "salary" }).map((x) => x.id)).toEqual(["1"]);
    expect(filterTransactions(list, { query: "savings" }).map((x) => x.id)).toEqual(["3"]);
    expect(filterTransactions(list, { query: "food", categoryName: (x) => (x.category === "3" ? "Food" : "") })
      .map((x) => x.id)).toEqual(["2"]);
  });
});

describe("otherAccountName", () => {
  it("names the other side of a transfer", () => {
    expect(otherAccountName(list[2])).toBe("Savings");
    expect(otherAccountName({ type: "in-transfer", sourceAccount: { name: "Main" } })).toBe("Main");
    expect(otherAccountName(list[0])).toBeUndefined();
  });
});
