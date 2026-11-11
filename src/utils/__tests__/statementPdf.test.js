import { describe, it, expect } from "vitest";
import { pdfPeriod, statementFileName } from "../accounts/statementPdf";

const today = new Date("2026-11-10T12:00:00");
const rows = [
  { createdAt: "2026-03-05T10:00:00" },
  { createdAt: "2026-01-20T10:00:00" },
  { createdAt: "not a date" },
];

describe("statement PDF", () => {
  it("all transactions: from the first one to today", () => {
    expect(pdfPeriod("none", null, rows, today)).toEqual({ from: "2026-01-20", to: "2026-11-10" });
    expect(pdfPeriod("none", null, [], today)).toEqual({ from: "2026-11-10", to: "2026-11-10" });
  });

  it("the fixed periods and a valid custom one", () => {
    expect(pdfPeriod("lastMonth", null, rows, today)).toEqual({ from: "2026-10-01", to: "2026-10-31" });
    expect(pdfPeriod("custom", { from: "2026-02-01", to: "2026-02-10" }, rows, today))
      .toEqual({ from: "2026-02-01", to: "2026-02-10" });
    expect(pdfPeriod("custom", { from: "2026-02-10", to: "2026-02-01" }, rows, today)).toBeNull();
  });

  it("names the file after the account, the currency and the period", () => {
    expect(statementFileName("الحمصي / ينا", "USD", { from: "2026-11-01", to: "2026-11-05" }))
      .toBe("الحمصي ينا - USD - 2026-11-01 - 2026-11-05.pdf");
  });
});