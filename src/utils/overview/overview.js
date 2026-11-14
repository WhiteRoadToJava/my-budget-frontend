// Numbers for the overview page. Everything is kept per currency:
// amounts in different currencies are never added together.
import { addDays, addMonths, format, startOfDay, startOfMonth } from "date-fns";
import { signedAmount } from "../transactions/transactionList";
import { pocketsOf, transactionCurrency } from "../accounts/pockets";

const round2 = (n) => Math.round(n * 100) / 100;

const monthKeyOf = (date) => format(date, "yyyy-MM");

const dateOf = (t) => {
  const d = new Date(t?.createdAt);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const currencyOf = (t) => transactionCurrency(t);

// Money that really came in or went out. A transfer between two of your
// accounts moves nothing in or out, so it is left out; its fees are kept.
// transfers between own accounts and cancelled transactions are no money in or out
export const isRealFlow = (t) => t?.type !== "in-transfer" && t?.type !== "out-transfer" && t?.cancelled !== true;

// { [currency]: { in, out, net } } for the month of `month`
export const monthTotals = (transactions = [], month = new Date()) => {
  const key = monthKeyOf(month);
  const totals = {};
  for (const t of transactions) {
    const date = dateOf(t);
    if (!date || !isRealFlow(t) || monthKeyOf(date) !== key) continue;
    const currency = currencyOf(t);
    const entry = (totals[currency] ??= { in: 0, out: 0, net: 0 });
    const amount = signedAmount(t);
    if (amount >= 0) entry.in = round2(entry.in + amount);
    else entry.out = round2(entry.out - amount);
    entry.net = round2(entry.in - entry.out);
  }
  return totals;
};

// the last `count` months, oldest first, in one currency: [{ key, in, out }]
export const monthlyFlows = (transactions = [], currency, count = 6, today = new Date()) => {
  const months = Array.from({ length: count }, (_, i) =>
    monthKeyOf(addMonths(startOfMonth(today), i - (count - 1))),
  );
  const byKey = Object.fromEntries(months.map((key) => [key, { key, in: 0, out: 0 }]));
  for (const t of transactions) {
    const date = dateOf(t);
    if (!date || !isRealFlow(t) || currencyOf(t) !== currency) continue;
    const entry = byKey[monthKeyOf(date)];
    if (!entry) continue;
    const amount = signedAmount(t);
    if (amount >= 0) entry.in = round2(entry.in + amount);
    else entry.out = round2(entry.out - amount);
  }
  return months.map((key) => byKey[key]);
};

// the biggest expense categories of the month, in one currency
export const topExpenseCategories = (transactions = [], currency, nameOf, month = new Date(), limit = 5) => {
  const key = monthKeyOf(month);
  const sums = {};
  for (const t of transactions) {
    const date = dateOf(t);
    if (!date || t.type !== "expense" || t.cancelled === true || currencyOf(t) !== currency || monthKeyOf(date) !== key) continue;
    const name = nameOf(t) || "—";
    sums[name] = round2((sums[name] ?? 0) + Math.abs(Number(t.amount ?? 0)));
  }
  return Object.entries(sums)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

// active schedules due within the next `days` days (and any not run yet), soonest first
export const upcomingSchedules = (schedules = [], days = 7, today = new Date()) => {
  const end = addDays(startOfDay(today), days + 1);
  return schedules
    .filter((s) => s.isActive !== false && s.executionDate)
    .map((s) => ({ ...s, due: new Date(String(s.executionDate).slice(0, 10) + "T00:00:00") }))
    .filter((s) => !Number.isNaN(s.due.getTime()) && s.due < end)
    .sort((a, b) => a.due - b.due);
};

// currencies of the user's active accounts, the most used first
export const accountCurrencies = (accounts = []) => {
  const counts = {};
  for (const a of accounts) for (const p of pocketsOf(a)) counts[p.currency] = (counts[p.currency] ?? 0) + 1;
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
};
