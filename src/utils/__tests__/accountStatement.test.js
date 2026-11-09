import { describe, it, expect } from "vitest";
import {
  periodPreset, isValidPeriod, formatMoney, balancePhrase, balanceAt, buildAccountStatement,
} from "../accounts/accountStatement";

// simple translator: returns the key, with values appended, so the tests
// check the structure without depending on the translation files
const t = (key, values) => (values ? `${key}(${Object.values(values).join(",")})` : key);

const account = { id: "a1", name: "Ali", currency: "SEK", totalBalance: 1200 };
const tx = [
  { id: "1", type: "incomse", category: "1", amount: 2000, createdAt: "2026-10-05T10:00:00", description: "Payment" },
  { id: "2", type: "expense", category: "2", amount: 300, createdAt: "2026-10-20T12:00:00", description: "  " },
  { id: "3", type: "out-transfer", amount: 500, createdAt: "2026-10-25T09:00:00", destinationAccount: { name: "Secret" }, description: "Rent share" },
  { id: "4", type: "in-transfer", amount: 100, createdAt: "2026-11-02T09:00:00" },
];
const today = new Date(2026, 10, 10); // 10 Nov 2026

describe("periods", () => {
  it("builds the presets", () => {
    expect(periodPreset("thisMonth", today)).toEqual({ from: "2026-11-01", to: "2026-11-10" });
    expect(periodPreset("lastMonth", today)).toEqual({ from: "2026-10-01", to: "2026-10-31" });
    expect(periodPreset("none", today)).toBeNull();
  });

  it("checks the period", () => {
    expect(isValidPeriod({ from: "2026-10-01", to: "2026-10-31" })).toBe(true);
    expect(isValidPeriod({ from: "2026-11-01", to: "2026-10-31" })).toBe(false);
    expect(isValidPeriod(null)).toBe(false);
  });
});

describe("balance wording", () => {
  it("positive: they owe us, negative: we owe them, zero: no words", () => {
    expect(balancePhrase(1200, "en", t)).toBe("share.theyOweUs 1,200.00");
    expect(balancePhrase(-300, "en", t)).toBe("share.weOweThem 300.00");
    expect(balancePhrase(0, "en", t)).toBe("0.00");
  });

  it("uses Latin digits in Arabic and Swedish grouping", () => {
    expect(formatMoney(1234.5, "ar")).toMatch(/1.?234.50|1.?234,50/);
    expect(formatMoney(1234.5, "ar")).not.toMatch(/[٠-٩]/);
    expect(formatMoney(1234.5, "sv").replace(/\s/g, " ")).toBe("1 234,50");
  });

  it("computes the balance at the end of a past period", () => {
    // after 31 Oct only transaction 4 (+100) happened: 1200 - 100
    expect(balanceAt(1200, tx, "2026-10-31")).toBe(1100);
  });
});

describe("buildAccountStatement", () => {
  it("without a period: name, currency and current balance only", () => {
    const text = buildAccountStatement({ account, transactions: tx, period: null, language: "en", t, today });
    expect(text.split("\n").slice(0, 5)).toEqual([
      "📊 share.statementFor(Ali)",
      "share.currency: SEK",
      "share.currentBalance: share.theyOweUs 1,200.00",
      "",
      "— share.sentFrom",
    ]);
  });

  it("ends with a green bar for a positive balance and a red one for a negative", () => {
    const green = buildAccountStatement({ account, transactions: [], period: null, language: "en", t, today });
    const red = buildAccountStatement({ account: { ...account, totalBalance: -5 }, transactions: [], period: null, language: "en", t, today });
    expect(green.trimEnd().endsWith("🟩")).toBe(true);
    expect(red.trimEnd().endsWith("🟥")).toBe(true);
  });

  it("with a past period: totals, both balances and the transactions", () => {
    const text = buildAccountStatement({
      account, transactions: tx, period: { from: "2026-10-01", to: "2026-10-31" }, language: "en", t, today,
    });
    expect(text).toContain("share.moneyIn: + 2,000.00");
    expect(text).toContain("share.moneyOut: − 800.00");
    expect(text).toContain("share.balanceAtEnd: share.theyOweUs 1,100.00");
    expect(text).toContain("share.currentBalance: share.theyOweUs 1,200.00");
    // oldest first, description on its own line, blank description left out
    expect(text).toContain("• 5 Oct  Salary  + 2,000.00\n   Payment");
    expect(text).toContain("• 20 Oct  Food  − 300.00\n• 25 Oct");
    // transfers never name the other account
    expect(text).toContain("share.transferOut  − 500.00\n   Rent share");
    expect(text).not.toContain("Secret");
    // November is outside the period
    expect(text).not.toContain("share.transferIn");
  });

  it("a period that ends today shows only the current balance", () => {
    const text = buildAccountStatement({
      account, transactions: tx, period: periodPreset("thisMonth", today), language: "en", t, today,
    });
    expect(text).not.toContain("share.balanceAtEnd");
    expect(text).toContain("share.transferIn  + 100.00");
  });

  it("says when the period has no transactions", () => {
    const text = buildAccountStatement({
      account, transactions: tx, period: { from: "2026-09-01", to: "2026-09-30" }, language: "en", t, today,
    });
    expect(text).toContain("share.noTransactions");
  });

  it("a statement of one currency keeps only that currency", () => {
    const wallet = { name: "Wallet", currency: "SYP", totalBalance: 0,
      balances: [{ currency: "SYP", openingBalance: 0, totalBalance: 0 }, { currency: "USD", openingBalance: 0, totalBalance: 40 }] };
    const rows = [
      { id: "u", type: "incomse", category: "1", amount: 40, currency: "USD", createdAt: "2026-10-05T10:00:00" },
      { id: "s", type: "incomse", category: "1", amount: 99, currency: "SYP", createdAt: "2026-10-06T10:00:00" },
    ];
    const text = buildAccountStatement({ account: wallet, transactions: rows, currency: "USD",
      period: { from: "2026-10-01", to: "2026-10-31" }, language: "en", t, today });
    expect(text).toContain("share.currency: USD");
    expect(text).toContain("share.moneyIn: + 40.00");
    expect(text).not.toContain("99.00");
  });
});
