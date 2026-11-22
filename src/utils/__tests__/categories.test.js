import { describe, it, expect } from "vitest";
import i18n from "../../configuration/i18n";
import {
  categoryLabel,
  categoryOption,
  debtCategory,
  findCategory,
  moveId,
} from "../categories/categories";

const categories = [
  { id: "a", type: "EXPENSE", key: "1", defaultKey: "rent", name: null, emoji: "🏠" },
  { id: "b", type: "INCOME", key: "1", defaultKey: "salary", name: null, emoji: "💼" },
  { id: "c", type: "EXPENSE", key: "c", defaultKey: null, name: "Coffee", emoji: "☕" },
];

describe("findCategory", () => {
  it("finds the Debt category for debt records and movements", () => {
    expect(findCategory(categories, "Debt", "expense")).toBe(debtCategory);
    expect(findCategory(categories, undefined, "debt-out")).toBe(debtCategory);
  });

  it("finds by key and type, so the same old number is different for incomes and expenses", () => {
    expect(findCategory(categories, "1", "expense")).toBe(categories[0]);
    expect(findCategory(categories, 1, "incomse")).toBe(categories[1]);
    expect(findCategory(categories, "c", "expense")).toBe(categories[2]);
  });

  it("finds nothing for an unknown key or while the categories load", () => {
    expect(findCategory(categories, "999", "expense")).toBeUndefined();
    expect(findCategory([], "1", "expense")).toBeUndefined();
  });
});

describe("categoryLabel", () => {
  it("translates a ready-made category and keeps the user's own name", async () => {
    await i18n.changeLanguage("en");
    expect(categoryLabel(categories[0])).toBe("Rent");
    expect(categoryLabel(categories[2])).toBe("Coffee");
    expect(categoryLabel({ ...categories[0], name: "Shop rent" })).toBe("Shop rent");
    expect(categoryOption(categories[1])).toBe("💼 Salary");
  });
});

describe("moveId", () => {
  it("swaps an item with its neighbour", () => {
    expect(moveId(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveId(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
  });

  it("leaves the list as it is at the ends", () => {
    const ids = ["a", "b"];
    expect(moveId(ids, 0, -1)).toBe(ids);
    expect(moveId(ids, 1, 1)).toBe(ids);
  });
});
