import { describe, it, expect } from "vitest";
import {
  debtSchedulesOf, paymentStatusKey, emptyPaymentForm,
  validatePaymentForm, formToScheduleRequest, intervalLabelKey,
} from "../debts/debtSchedules";

const today = new Date(2026, 10, 2); // 2 Nov 2026

describe("debtSchedulesOf", () => {
  it("keeps only payment schedules of this debt", () => {
    const schedules = [
      { id: "1", transactionType: "DEBT_PAYMENT", debtId: "d1" },
      { id: "2", transactionType: "DEBT_PAYMENT", debtId: "d2" },
      { id: "3", transactionType: "EXPENSE" },
    ];
    expect(debtSchedulesOf(schedules, "d1").map((s) => s.id)).toEqual(["1"]);
    expect(debtSchedulesOf(undefined, "d1")).toEqual([]);
  });
});

describe("paymentStatusKey", () => {
  it("is active, paused, or finished when the debt is settled", () => {
    expect(paymentStatusKey({ isActive: true }, {})).toBe("scheduleInfo.active");
    expect(paymentStatusKey({ isActive: false }, { summary: { totalOwed: 50 } })).toBe("scheduleInfo.paused");
    expect(paymentStatusKey({ isActive: false }, { summary: { totalOwed: 0 } })).toBe("debts.paymentFinished");
  });
});

describe("payment form", () => {
  const valid = { ...emptyPaymentForm(today), amount: "100", accountId: "a1" };

  it("accepts a valid payment starting today", () => {
    expect(validatePaymentForm(valid, today)).toBeNull();
  });

  it.each([
    [{ amount: "" }, "debts.validation.amountPositive"],
    [{ amount: "-5" }, "debts.validation.amountPositive"],
    [{ interval: "" }, "debts.validation.intervalRequired"],
    [{ firstDate: "" }, "debts.validation.dateRequired"],
    [{ firstDate: "2026-11-01" }, "debts.validation.noPastDate"],
    [{ accountId: "" }, "debts.validation.accountRequired"],
  ])("rejects %o", (change, key) => {
    expect(validatePaymentForm({ ...valid, ...change }, today)).toBe(key);
  });

  it("builds the schedule request", () => {
    expect(formToScheduleRequest(valid, { id: "d1", name: "Car loan" })).toEqual({
      name: "Car loan",
      description: "",
      sourceAccountId: "a1",
      debtId: "d1",
      transactionTypes: ["DEBT_PAYMENT"],
      scheduleIntervals: ["MONTHLY"],
      amountSend: 100,
      nextExecutionDate: "2026-11-02T00:00:00.000Z",
      isActive: true,
    });
  });

  it("has a label for each interval", () => {
    expect(intervalLabelKey("WEEKLY")).toBe("debts.intervalWeekly");
  });
});
