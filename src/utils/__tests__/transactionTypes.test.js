import { describe, it, expect } from "vitest";
import { typeLabelKey, isDebtMovement, belongsToDebt } from "../transactionTypes";

describe("transaction types", () => {
  it("has a label for every type the backend sends", () => {
    for (const type of ["incomse", "expense", "in-transfer", "out-transfer", "debt-in", "debt-out"]) {
      expect(typeLabelKey(type)).toMatch(/^transactionDetails\./);
    }
    expect(typeLabelKey("unknown")).toBeUndefined();
  });

  it("recognises debt movements", () => {
    expect(isDebtMovement({ type: "debt-in" })).toBe(true);
    expect(isDebtMovement({ type: "expense", category: "Debt" })).toBe(false);
  });

  it("treats debt movements and Debt-category records as belonging to a debt", () => {
    expect(belongsToDebt({ type: "debt-out" })).toBe(true);
    expect(belongsToDebt({ type: "expense", category: "Debt" })).toBe(true);
    expect(belongsToDebt({ type: "expense", category: "3" })).toBe(false);
    expect(belongsToDebt(undefined)).toBe(false);
  });
});
