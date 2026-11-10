import { describe, it, expect } from "vitest";
import { filterOptions, normalizeText } from "../search/matchText";

const accounts = ["أحمد عباس", "Revolut", "محمد الحلاق ابو عبدو", "اموال نقدية", "Mohammad konto"];

describe("account search", () => {
  it("ignores case, spaces and the forms of Arabic letters", () => {
    expect(normalizeText("  أحْمَـد  ")).toBe("احمد");
    expect(normalizeText("نقدية")).toBe(normalizeText("نقديه"));
  });

  it("finds by part of the name", () => {
    expect(filterOptions(accounts, "rev")).toEqual(["Revolut"]);
    expect(filterOptions(accounts, "احمد")).toEqual(["أحمد عباس"]);
    expect(filterOptions(accounts, "نقديه")).toEqual(["اموال نقدية"]);
  });

  it("needs every word, in any order", () => {
    expect(filterOptions(accounts, "عبدو الحلاق")).toEqual(["محمد الحلاق ابو عبدو"]);
    expect(filterOptions(accounts, "mohammad x")).toEqual([]);
  });

  it("shows everything for an empty search", () => {
    expect(filterOptions(accounts, "  ")).toEqual(accounts);
  });
});