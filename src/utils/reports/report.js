// Numbers for the report page. Like the overview, everything is in one currency at a time
// (amounts in different currencies are never added together) and uses the same rules:
// transfers between the user's own accounts are left out, their fees are kept, and a
// cancelled row counts on its own day while its reversal counts on the day it was cancelled.
import {
  addDays, addMonths, differenceInCalendarDays, differenceInCalendarMonths,
  format, parseISO, startOfDay, startOfMonth, startOfYear,
} from "date-fns";
import { addToTotals, isIncoming, isReversal, isTransferFee, signedAmount } from "../transactions/transactionList";
import { isRealFlow, currencyOf } from "../overview/overview";
import { DEBT_CATEGORY } from "../categories/categories";

export const PERIODS = ["thisMonth", "lastMonth", "last3", "last6", "last12", "thisYear", "custom"];

const round2 = (n) => Math.round(n * 100) / 100;

const dateOf = (t) => {
  const d = new Date(t?.createdAt);
  return Number.isNaN(d.getTime()) ? null : d;
};

// { from, to }: from the first day, up to (not including) `to`.
// The periods that end today run until the end of today.
// custom: { from: "yyyy-MM-dd", to: "yyyy-MM-dd" }, both days included; null when not complete.
export const periodRange = (period, today = new Date(), custom = {}) => {
  const tomorrow = addDays(startOfDay(today), 1);
  const month = startOfMonth(today);
  switch (period) {
    case "lastMonth":
      return { from: addMonths(month, -1), to: month };
    case "last3":
      return { from: addMonths(month, -2), to: tomorrow };
    case "last6":
      return { from: addMonths(month, -5), to: tomorrow };
    case "last12":
      return { from: addMonths(month, -11), to: tomorrow };
    case "thisYear":
      return { from: startOfYear(today), to: tomorrow };
    case "custom": {
      if (!custom.from || !custom.to) return null;
      const from = parseISO(custom.from);
      const to = addDays(parseISO(custom.to), 1);
      return to > from ? { from, to } : null;
    }
    default: // thisMonth
      return { from: month, to: tomorrow };
  }
};

// the period just before, to compare with: whole months back when the period starts on
// the first of a month (1–23 Nov is compared with 1–23 Oct), else as many days back
export const previousRange = ({ from, to }) => {
  if (from.getDate() === 1) {
    const months = differenceInCalendarMonths(addDays(to, -1), from) + 1;
    return { from: addMonths(from, -months), to: addMonths(to, -months) };
  }
  const days = differenceInCalendarDays(to, from);
  return { from: addDays(from, -days), to: from };
};

const inRange = (date, { from, to }) => date >= from && date < to;

// the rows of the report: real money in or out, in one currency, inside the period
export const reportRows = (transactions = [], currency, range) =>
  transactions.filter((t) => {
    const date = dateOf(t);
    return date && isRealFlow(t) && currencyOf(t) === currency && inRange(date, range);
  });

// money in, out, net and the part of the income that was kept
export const totalsOf = (rows = []) => {
  const totals = { in: 0, out: 0 };
  for (const t of rows) addToTotals(totals, t);
  const net = round2(totals.in - totals.out);
  const savingsRate = totals.in > 0 ? Math.round((net / totals.in) * 100) : null;
  return { in: totals.in, out: totals.out, net, savingsRate };
};

// percent change from the previous period; null when there is nothing to compare with
export const changePercent = (current, previous) =>
  previous ? Math.round(((current - previous) / Math.abs(previous)) * 100) : null;

// what a row is grouped under: its category, "Debt" for debt rows, "fees" for transfer fees
export const groupKeyOf = (t) => {
  if (isTransferFee(t)) return "fees";
  if (t.type === "debt-in" || t.type === "debt-out" || t.category === DEBT_CATEGORY) return DEBT_CATEGORY;
  return `${t.type}:${t.category ?? ""}`;
};

// money out (or in) by category, biggest first: [{ key, sample, amount }]
// sample is one of its rows, to find the category's name and emoji.
// A reversal takes its amount back from the category in the period it was cancelled.
export const byCategory = (rows = [], incoming = false) => {
  const groups = new Map();
  for (const t of rows) {
    if (isIncoming(t) !== incoming) continue;
    const key = groupKeyOf(t);
    const amount = (isReversal(t) ? -1 : 1) * Math.abs(Number(t.amount ?? 0));
    const group = groups.get(key) ?? { key, sample: t, amount: 0 };
    group.amount = round2(group.amount + amount);
    groups.set(key, group);
  }
  return [...groups.values()].filter((g) => g.amount > 0).sort((a, b) => b.amount - a.amount);
};

// money in and out for every month of the period, oldest first: [{ key, in, out }]
export const monthlyOf = (rows = [], { from, to }) => {
  const months = [];
  for (let m = startOfMonth(from); m < to; m = addMonths(m, 1)) months.push(format(m, "yyyy-MM"));
  const byKey = Object.fromEntries(months.map((key) => [key, { key, in: 0, out: 0 }]));
  for (const t of rows) {
    const entry = byKey[format(dateOf(t), "yyyy-MM")];
    if (entry) addToTotals(entry, t);
  }
  return months.map((key) => byKey[key]);
};

// the biggest rows of the period, by amount (reversals are left out: they repeat a row)
export const biggestOf = (rows = [], limit = 5) =>
  rows
    .filter((t) => !isReversal(t))
    .sort((a, b) => Math.abs(signedAmount(b)) - Math.abs(signedAmount(a)))
    .slice(0, limit);

// the currencies the user has moved money in, the most used first
export const reportCurrencies = (transactions = []) => {
  const counts = {};
  for (const t of transactions) {
    if (!isRealFlow(t)) continue;
    const c = currencyOf(t);
    if (c) counts[c] = (counts[c] ?? 0) + 1;
  }
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
};

// the currency shown first: the one chosen, else the base currency, else the most used
export const reportCurrency = (currencies = [], chosen, baseCurrency) => {
  if (chosen && currencies.includes(chosen)) return chosen;
  if (baseCurrency && currencies.includes(baseCurrency)) return baseCurrency;
  return currencies[0] ?? null;
};

// everything the page shows, for one currency and period
export const buildReport = (transactions = [], currency, range) => {
  const rows = reportRows(transactions, currency, range);
  const previous = totalsOf(reportRows(transactions, currency, previousRange(range)));
  const totals = totalsOf(rows);
  return {
    totals,
    previous,
    changes: {
      in: changePercent(totals.in, previous.in),
      out: changePercent(totals.out, previous.out),
      net: changePercent(totals.net, previous.net),
    },
    expenses: byCategory(rows, false),
    incomes: byCategory(rows, true),
    monthly: monthlyOf(rows, range),
    biggest: biggestOf(rows),
    count: rows.length,
  };
};