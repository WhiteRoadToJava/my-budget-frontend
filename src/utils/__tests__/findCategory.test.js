import { describe, it, expect } from "vitest";
import {
  findCategory,
  debtCategory,
  expenseCategoryList,
  incomseCategoryList,
} from "../../assiets/categories/assits";

describe("findCategory", () => {
  it("returns the Debt category for records the backend stores as \"Debt\"", () => {
    expect(findCategory("Debt", "expense")).toBe(debtCategory);
    expect(findCategory("Debt", "incomse")).toBe(debtCategory);
  });

  it("returns the Debt category for debt-in / debt-out rows", () => {
    expect(findCategory("Debt", "debt-in")).toBe(debtCategory);
    expect(findCategory(undefined, "debt-out")).toBe(debtCategory);
  });

  it("still finds normal categories by numeric id (stored as string or number)", () => {
    expect(findCategory("1", "expense")).toBe(expenseCategoryList[0]);
    expect(findCategory(1, "incomse")).toBe(incomseCategoryList[0]);
  });

  it("returns undefined for an unknown id", () => {
    expect(findCategory("999", "expense")).toBeUndefined();
  });

  it("keeps Debt out of the lists users pick from", () => {
    expect(expenseCategoryList).not.toContain(debtCategory);
    expect(incomseCategoryList).not.toContain(debtCategory);
  });
});
