import { describe, it, expect } from "vitest";
import {
  periodRange, previousRange, reportRows, totalsOf, changePercent, byCategory,
  monthlyOf, biggestOf, reportCurrencies, reportCurrency, buildReport,
} from "../reports/report";

const today = new Date(2026, 10, 23, 15, 30); // 23 Nov 2026
const day = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// a range as two "yyyy-MM-dd" texts, easier to read in the tests
const range = (r) => ({ from: day(r.from), to: day(r.to) });

const row = (type, amount, createdAt, extra = {}) => ({
  id: `${type}-${amount}-${createdAt}`, type, amount, createdAt, currency: "SEK", ...extra,
});

describe("periodRange", () => {
  it.each([
    ["thisMonth", "2026-11-01", "2026-11-24"],
    ["lastMonth", "2026-10-01", "2026-11-01"],
    ["last3", "2026-09-01", "2026-11-24"],
    ["last6", "2026-06-01", "2026-11-24"],
    ["last12", "2025-12-01", "2026-11-24"],
    ["thisYear", "2026-01-01", "2026-11-24"],
  ])("%s runs from %s up to %s", (period, from, to) => {
    expect(range(periodRange(period, today))).toEqual({ from, to });
  });

  it("includes both chosen days of a custom period", () => {
    expect(range(periodRange("custom", today, { from: "2026-03-05", to: "2026-03-10" })))
      .toEqual({ from: "2026-03-05", to: "2026-03-11" });
  });

  it("returns null for an incomplete or backwards custom period", () => {
    expect(periodRange("custom", today, { from: "2026-03-05" })).toBeNull();
    expect(periodRange("custom", today, { from: "2026-03-10", to: "2026-03-05" })).toBeNull();
  });
});

describe("previousRange", () => {
  it("goes back whole months when the period starts on the first", () => {
    expect(range(previousRange(periodRange("thisMonth", today)))).toEqual({ from: "2026-10-01", to: "2026-10-24" });
    expect(range(previousRange(periodRange("lastMonth", today)))).toEqual({ from: "2026-09-01", to: "2026-10-01" });
    expect(range(previousRange(periodRange("last3", today)))).toEqual({ from: "2026-06-01", to: "2026-08-24" });
  });

  it("goes back as many days otherwise", () => {
    const custom = periodRange("custom", today, { from: "2026-03-05", to: "2026-03-10" });
    expect(range(previousRange(custom))).toEqual({ from: "2026-02-27", to: "2026-03-05" });
  });
});

describe("report numbers", () => {
  const transactions = [
    row("incomse", 1000, "2026-11-02T09:00:00", { category: "1" }),
    row("expense", 200, "2026-11-03T09:00:00", { category: "5" }),
    row("expense", 50, "2026-11-04T09:00:00", { category: "5" }),
    row("expense", 100, "2026-11-05T09:00:00", { category: "7" }),
    row("transfer-fee-out", 10, "2026-11-06T09:00:00"),
    row("debt-out", 30, "2026-11-07T09:00:00"),
    // a transfer between own accounts is not money in or out
    row("out-transfer", 500, "2026-11-08T09:00:00"),
    row("in-transfer", 500, "2026-11-08T09:00:00"),
    // another currency and another month are not in the November SEK report
    row("expense", 999, "2026-11-09T09:00:00", { currency: "EUR" }),
    row("expense", 80, "2026-10-15T09:00:00", { category: "5" }),
    // an October expense cancelled in November: taken back in November
    row("expense", 40, "2026-11-10T09:00:00", { category: "7", reversal: true }),
  ];
  const november = periodRange("thisMonth", today);

  it("keeps the real money in the period and the currency", () => {
    expect(reportRows(transactions, "SEK", november)).toHaveLength(7);
  });

  it("adds money in and out by the sign of each row", () => {
    const totals = totalsOf(reportRows(transactions, "SEK", november));
    // out: 200 + 50 + 100 + 10 + 30 = 390; the reversal of 40 is money back in
    expect(totals).toEqual({ in: 1040, out: 390, net: 650, savingsRate: 63 });
  });

  it("has no savings rate without income", () => {
    expect(totalsOf([row("expense", 10, "2026-11-02T09:00:00")]).savingsRate).toBeNull();
  });

  it("groups by category, fees and debts, biggest first, with reversals taken back", () => {
    const groups = byCategory(reportRows(transactions, "SEK", november));
    expect(groups.map((g) => [g.key, g.amount])).toEqual([
      ["expense:5", 250],
      ["expense:7", 60],
      ["Debt", 30],
      ["fees", 10],
    ]);
    expect(byCategory(reportRows(transactions, "SEK", november), true).map((g) => g.key)).toEqual(["incomse:1"]);
  });

  it("gives one entry for every month of the period", () => {
    const flows = monthlyOf(reportRows(transactions, "SEK", periodRange("last3", today)), periodRange("last3", today));
    expect(flows.map((f) => f.key)).toEqual(["2026-09", "2026-10", "2026-11"]);
    expect(flows[1]).toEqual({ key: "2026-10", in: 0, out: 80 });
  });

  it("lists the biggest rows without reversals", () => {
    const biggest = biggestOf(reportRows(transactions, "SEK", november), 2);
    expect(biggest.map((t) => t.amount)).toEqual([1000, 200]);
  });

  it("compares with the period before", () => {
    const report = buildReport(transactions, "SEK", november);
    expect(report.previous.out).toBe(80);
    expect(report.changes.out).toBe(388);
    expect(report.changes.in).toBeNull();
  });

  it("works out the change in percent", () => {
    expect(changePercent(150, 100)).toBe(50);
    expect(changePercent(50, 100)).toBe(-50);
    expect(changePercent(100, -50)).toBe(300);
    expect(changePercent(100, 0)).toBeNull();
  });
});

describe("report currency", () => {
  const transactions = [
    row("expense", 1, "2026-11-01T09:00:00", { currency: "EUR" }),
    row("expense", 1, "2026-11-01T09:00:00", { currency: "SEK" }),
    row("expense", 1, "2026-11-01T09:00:00", { currency: "SEK" }),
    row("out-transfer", 1, "2026-11-01T09:00:00", { currency: "USD" }),
  ];

  it("lists the currencies money moved in, the most used first", () => {
    expect(reportCurrencies(transactions)).toEqual(["SEK", "EUR"]);
  });

  it("starts with the chosen currency, then the base currency, then the most used", () => {
    expect(reportCurrency(["SEK", "EUR"], "EUR", "SEK")).toBe("EUR");
    expect(reportCurrency(["SEK", "EUR"], null, "EUR")).toBe("EUR");
    expect(reportCurrency(["SEK", "EUR"], null, "USD")).toBe("SEK");
    expect(reportCurrency([], null, "SEK")).toBeNull();
  });
});