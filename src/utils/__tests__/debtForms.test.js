import { describe, it, expect } from "vitest";
import {
  emptyDebtForm, debtToForm, formToDebtRequest, validateDebtForm,
  emptyMovementForm, formToMovementRequest, validateMovementForm,
  usableAccounts, debtErrorKey,
} from "../debts/debtForms";

const today = new Date(2026, 10, 2); // 2 Nov 2026
const validDebt = { ...emptyDebtForm(today), name: "Car", currency: "SEK" };

describe("debt form", () => {
  it("starts with today's date and no interest", () => {
    expect(emptyDebtForm(today)).toMatchObject({ startDate: "2026-11-02", annualRate: "0", compounding: "NONE" });
  });

  it("accepts a valid debt", () => {
    expect(validateDebtForm(validDebt, today)).toBeNull();
  });

  it.each([
    [{ name: "  " }, "debts.validation.nameRequired"],
    [{ currency: "" }, "debts.validation.currencyRequired"],
    [{ annualRate: "-1" }, "debts.validation.rateRange"],
    [{ annualRate: "101" }, "debts.validation.rateRange"],
    [{ annualRate: "" }, "debts.validation.rateRange"],
    [{ startDate: "" }, "debts.validation.startDateRequired"],
    [{ startDate: "2026-11-03" }, "debts.validation.noFutureDate"],
  ])("rejects %o", (change, key) => {
    expect(validateDebtForm({ ...validDebt, ...change }, today)).toBe(key);
  });

  it("converts to and from the API shape", () => {
    const debt = { name: "Car", counterparty: "Bank", direction: "OWED_TO_ME", currency: "SEK",
      annualRate: 4.5, compounding: "MONTHLY", startDate: "2026-01-10",
      countInflowsAsIncome: true, countOutflowsAsExpense: false, note: null };
    const request = formToDebtRequest(debtToForm(debt));
    expect(request).toEqual({ ...debt, note: "" });
    expect(typeof request.annualRate).toBe("number");
  });
});

describe("movement form", () => {
  const valid = { ...emptyMovementForm(today), amount: "100", accountId: "a1" };
  const ctx = { startDate: "2026-01-10", remaining: 250 };

  it("accepts a valid repayment", () => {
    expect(validateMovementForm(valid, ctx, today)).toBeNull();
  });

  it.each([
    [{ amount: "" }, "debts.validation.amountPositive"],
    [{ amount: "0" }, "debts.validation.amountPositive"],
    [{ date: "2026-11-03" }, "debts.validation.noFutureDate"],
    [{ date: "2026-01-09" }, "debts.validation.beforeStart"],
    [{ accountId: "" }, "debts.validation.accountRequired"],
    [{ amount: "250.01" }, "debts.validation.repaymentTooBig"],
  ])("rejects %o", (change, key) => {
    expect(validateMovementForm({ ...valid, ...change }, ctx, today)).toBe(key);
  });

  it("does not limit a new disbursement by the remaining amount", () => {
    expect(validateMovementForm({ ...valid, movementType: "DISBURSEMENT", amount: "5000" }, ctx, today)).toBeNull();
  });

  it("sends the amount as a number", () => {
    expect(formToMovementRequest(valid).amount).toBe(100);
  });
});

describe("usableAccounts", () => {
  it("keeps active accounts in the debt currency", () => {
    const accounts = [
      { id: "1", currency: "SEK", status: ["ACTIVE"] },
      { id: "2", currency: "USD", status: ["ACTIVE"] },
      { id: "3", currency: "SEK", status: ["ARCHIVED"] },
      { id: "4", currency: "SEK" },
    ];
    expect(usableAccounts(accounts, "SEK").map((a) => a.id)).toEqual(["1", "4"]);
  });
});

describe("debtErrorKey", () => {
  it("maps known backend sentences and falls back otherwise", () => {
    const err = (data) => ({ response: { status: 400, data } });
    expect(debtErrorKey(err("The account is archived"), "x")).toBe("debts.validation.accountArchived");
    expect(debtErrorKey(err("The currency can not be changed after movements were added"), "x"))
      .toBe("debts.validation.lockedAfterMovements");
    expect(debtErrorKey(err("something else"), "x")).toBe("x");
    expect(debtErrorKey(undefined, "x")).toBe("x");
  });
});
