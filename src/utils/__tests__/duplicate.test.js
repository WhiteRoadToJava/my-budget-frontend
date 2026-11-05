import { describe, it, expect } from "vitest";
import { canDuplicate, incomeExpenseDraft, transferDraft } from "../transactions/duplicate.js";

const acc = { id: "a1", name: "Main" };

describe("canDuplicate", () => {
  it("allows income, expense and transfers with existing accounts", () => {
    expect(canDuplicate({ type: "incomse", category: "1", sourceAccount: acc })).toBe(true);
    expect(canDuplicate({ type: "expense", category: "2", sourceAccount: acc })).toBe(true);
    expect(canDuplicate({ type: "out-transfer", sourceAccount: acc, destinationAccount: { id: "a2" } })).toBe(true);
  });

  it("refuses debt records and deleted accounts", () => {
    expect(canDuplicate({ type: "debt-out", sourceAccount: acc })).toBe(false);
    expect(canDuplicate({ type: "expense", category: "Debt", sourceAccount: acc })).toBe(false);
    expect(canDuplicate({ type: "in-transfer", sourceAccount: { name: "Deleted account" }, destinationAccount: acc })).toBe(false);
    expect(canDuplicate({ type: "out-transfer", sourceAccount: acc, destinationAccount: { name: "Deleted account" } })).toBe(false);
    expect(canDuplicate(undefined)).toBe(false);
  });
});

describe("drafts", () => {
  it("copies category and amount of an income or expense", () => {
    expect(incomeExpenseDraft({ category: "3", amount: 250.5 })).toEqual({ category: "3", amount: "250.5" });
  });

  it("copies the full transfer", () => {
    const transfer = { sourceAccount: acc, destinationAccount: { id: "a2" }, amountSent: 100, exChangeRate: 11.2, amountReceived: 1120, description: "Rent share" };
    expect(transferDraft(transfer)).toEqual({
      sourceAccount: { id: "a1" }, destinationAccount: { id: "a2" },
      amountSent: 100, exChangeRate: 11.2, amountReceived: 1120, description: "Rent share",
      fees: { sendFee: "", sendFeeDirection: "CHARGE", sendFeeAccountId: "",
        receiveFee: "", receiveFeeDirection: "CHARGE", receiveFeeAccountId: "" },
    });
  });
});