import { describe, it, expect } from "vitest";
import {
  mostUsedCurrency, emptyAccountForm, validateAccountForm, formToAccountRequest, accountErrorKey,
  ACCOUNT_CURRENCIES,
} from "../accounts/accountForm";

const accounts = [
  { name: "Main", currency: "SEK" },
  { name: "Cash", currency: "SEK" },
  { name: "Travel", currency: "EUR" },
];

describe("account form", () => {
  it("preselects the currency used most", () => {
    expect(mostUsedCurrency(accounts)).toBe("SEK");
    expect(mostUsedCurrency([])).toBe("");
    expect(emptyAccountForm(accounts)).toEqual({ name: "", type: "NORMAL", currency: "SEK", balance: "" });
  });

  it("accepts a valid form", () => {
    expect(validateAccountForm({ name: "Savings", type: "NORMAL", currency: "SEK", balance: "" }, accounts)).toBeNull();
  });

  it.each([
    [{ name: "  " }, "messages.nameRequired"],
    [{ name: " main " }, "createAccount.errorExists"],
    [{ type: "" }, "messages.typeRequired"],
    [{ currency: "" }, "messages.currencyRequired"],
    [{ balance: "abc" }, "createAccount.balanceInvalid"],
  ])("rejects %o", (change, key) => {
    const form = { name: "Savings", type: "NORMAL", currency: "SEK", balance: "", ...change };
    expect(validateAccountForm(form, accounts)).toBe(key);
  });

  it("builds the request with a numeric balance", () => {
    expect(formToAccountRequest({ name: " Savings ", type: "COMPANY", currency: "EUR", balance: "" }))
      .toEqual({ name: "Savings", type: "COMPANY", currency: "EUR", balance: 0 });
    expect(formToAccountRequest({ name: "A", type: "NORMAL", currency: "SEK", balance: "-12.5" }).balance).toBe(-12.5);
  });

  it("maps the duplicate name answer", () => {
    expect(accountErrorKey({ response: { data: "Account already exists" } })).toBe("createAccount.errorExists");
    expect(accountErrorKey({})).toBe("messages.errorCreateAccount");
  });

  it("has no duplicate currencies", () => {
    expect(new Set(ACCOUNT_CURRENCIES).size).toBe(ACCOUNT_CURRENCIES.length);
  });
});
