// The PDF statement made by the backend: which period to ask for and what to call the file.
import { format } from "date-fns";
import { isValidPeriod, periodPreset } from "./accountStatement";

const day = (date) => format(date, "yyyy-MM-dd");

// The period of the PDF (the backend needs both dates):
// "none" (all) = from the first transaction to today; "custom" = the chosen dates when valid.
export const pdfPeriod = (preset, range, transactions = [], today = new Date()) => {
  if (preset === "custom") return isValidPeriod(range) ? range : null;
  const fixed = periodPreset(preset, today);
  if (fixed) return fixed;
  const days = transactions
    .map((t) => new Date(t.createdAt))
    .filter((d) => !Number.isNaN(d.getTime()))
    .map(day)
    .sort();
  return { from: days[0] ?? day(today), to: day(today) };
};

// "Revolut - USD - 2026-11-01 - 2026-11-05.pdf"; characters files can not have are removed
export const statementFileName = (accountName, currency, period) => {
  const name = String(accountName ?? "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() || "statement";
  return `${name} - ${currency} - ${period.from} - ${period.to}.pdf`;
};