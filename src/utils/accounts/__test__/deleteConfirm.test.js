import { describe, expect, it } from "vitest";
import { confirmsDelete } from "../deleteAccount.js";

describe("confirmsDelete", () => {
  it("accepts the account name, ignoring case and extra spaces", () => {
    expect(confirmsDelete("  my   Wallet ", "My Wallet", "حذف")).toBe(true);
  });

  it("accepts the word delete in English or in the app's language", () => {
    expect(confirmsDelete("DELETE", "My Wallet", "حذف")).toBe(true);
    expect(confirmsDelete("حذف", "My Wallet", "حذف")).toBe(true);
  });

  it("refuses anything else", () => {
    expect(confirmsDelete("", "My Wallet", "حذف")).toBe(false);
    expect(confirmsDelete("My Walle", "My Wallet", "حذف")).toBe(false);
    expect(confirmsDelete("del", "My Wallet", "حذف")).toBe(false);
  });
});