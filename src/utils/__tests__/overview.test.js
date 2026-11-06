import { describe, it, expect } from "vitest";
import {
  isRealFlow, monthTotals, monthlyFlows, topExpenseCategories, upcomingSchedules, accountCurrencies,
} from "../overview/overview";

const sek = { currency: "SEK" };
const usd = { currency: "USD" };
const t = (type, amount, createdAt, account = sek, extra = {}) => ({ type, amount, createdAt, sourceAccount: account, ...extra });
const today = new Date(2026, 10, 15); // 15 Nov 2026

const tx = [
  t("incomse", 25000, "2026-11-01T09:00:00"),
  t("expense", 8000, "2026-11-02T09:00:00", sek, { category: "1" }),
  t("expense", 300, "2026-11-03T09:00:00", sek, { category: "2" }),
  t("expense", 200, "2026-11-04T09:00:00", sek, { category: "2" }),
  t("out-transfer", 5000, "2026-11-05T09:00:00"),         // between own accounts: not counted
  t("in-transfer", 5000, "2026-11-05T09:00:00"),
  t("transfer-fee-out", 15, "2026-11-05T09:00:00"),       // its fee is counted
  t("debt-in", 1000, "2026-11-06T09:00:00"),
  t("expense", 50, "2026-11-07T09:00:00", usd, { category: "2" }),
  t("expense", 400, "2026-10-10T09:00:00", sek, { category: "2" }),
];

describe("overview numbers", () => {
  it("leaves out transfers between own accounts but keeps their fees", () => {
    expect(isRealFlow({ type: "out-transfer" })).toBe(false);
    expect(isRealFlow({ type: "transfer-fee-out" })).toBe(true);
    expect(isRealFlow({ type: "debt-in" })).toBe(true);
  });

  it("totals this month per currency", () => {
    expect(monthTotals(tx, today)).toEqual({
      SEK: { in: 26000, out: 8515, net: 17485 },
      USD: { in: 0, out: 50, net: -50 },
    });
  });

  it("gives the last months oldest first, empty months included", () => {
    const flows = monthlyFlows(tx, "SEK", 3, today);
    expect(flows.map((f) => f.key)).toEqual(["2026-09", "2026-10", "2026-11"]);
    expect(flows[0]).toEqual({ key: "2026-09", in: 0, out: 0 });
    expect(flows[1]).toEqual({ key: "2026-10", in: 0, out: 400 });
    expect(flows[2]).toEqual({ key: "2026-11", in: 26000, out: 8515 });
  });

  it("ranks the expense categories of the month in one currency", () => {
    const nameOf = (x) => ({ 1: "Rent", 2: "Food" })[x.category];
    expect(topExpenseCategories(tx, "SEK", nameOf, today)).toEqual([
      { name: "Rent", amount: 8000 },
      { name: "Food", amount: 500 },
    ]);
  });

  it("lists active schedules due in the next 7 days, soonest first", () => {
    const schedules = [
      { id: "a", isActive: true, executionDate: "2026-11-20T00:00:00" },
      { id: "b", isActive: true, executionDate: "2026-11-16T00:00:00" },
      { id: "c", isActive: false, executionDate: "2026-11-16T00:00:00" },
      { id: "d", isActive: true, executionDate: "2026-12-30T00:00:00" },
      { id: "e", isActive: true, executionDate: "2026-11-22T00:00:00" },
    ];
    expect(upcomingSchedules(schedules, 7, today).map((s) => s.id)).toEqual(["b", "a", "e"]);
  });

  it("orders currencies by how many accounts use them", () => {
    expect(accountCurrencies([sek, usd, sek, { currency: "EUR" }])).toEqual(["SEK", "EUR", "USD"]);
  });
});
