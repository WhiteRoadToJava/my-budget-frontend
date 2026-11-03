import { describe, it, expect } from "vitest";
import {
  isArchived, splitAccounts, searchAccounts, totalsByCurrency, changeSinceOpening,
} from "../accounts/accountList";

const accounts = [
  { id: "1", name: "Savings", currency: "SEK", balance: 1000, totalBalance: 1500.1, status: ["ACTIVE"] },
  { id: "2", name: "Cash", currency: "SEK", balance: 0, totalBalance: 200.2, status: ["ACTIVE"] },
  { id: "3", name: "Travel", currency: "USD", balance: 500, totalBalance: 300, status: ["ACTIVE"] },
  { id: "4", name: "Old card", currency: "SEK", balance: 0, totalBalance: 50, status: ["ARCHIVED"] },
];

describe("accounts list", () => {
  it("splits active and archived, sorted by currency then name", () => {
    const { active, archived } = splitAccounts(accounts);
    expect(active.map((a) => a.id)).toEqual(["2", "1", "3"]);
    expect(archived.map((a) => a.id)).toEqual(["4"]);
    expect(isArchived(accounts[3])).toBe(true);
    expect(isArchived({})).toBe(false);
  });

  it("searches by name or currency, ignoring case and spaces", () => {
    expect(searchAccounts(accounts, " sav ").map((a) => a.id)).toEqual(["1"]);
    expect(searchAccounts(accounts, "usd").map((a) => a.id)).toEqual(["3"]);
    expect(searchAccounts(accounts, "")).toHaveLength(4);
  });

  it("adds totals per currency without float noise", () => {
    expect(totalsByCurrency(accounts.slice(0, 3))).toEqual([
      { currency: "SEK", total: 1700.3 },
      { currency: "USD", total: 300 },
    ]);
  });

  it("computes the change since opening", () => {
    expect(changeSinceOpening(accounts[0])).toBe(500.1);
    expect(changeSinceOpening(accounts[2])).toBe(-200);
    expect(changeSinceOpening({})).toBe(0);
  });
});
