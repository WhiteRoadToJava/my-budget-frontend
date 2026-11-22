// Pure helpers for transaction lists: direction, grouping by month, filters.

const INCOMING = new Set(["incomse", "in-transfer", "debt-in", "transfer-fee-in"]);

export const isIncoming = (t) => INCOMING.has(t?.type);

// A cancelled transaction still counts on its own day; the server adds a second row,
// the reversal, that takes it back on the day it was cancelled.
export const isCancelled = (t) => t?.cancelled === true;
export const isReversal = (t) => t?.reversal === true;

// amount with the sign of its effect on the account (a reversal has the opposite sign)
export const signedAmount = (t) =>
  (isIncoming(t) ? 1 : -1) * (isReversal(t) ? -1 : 1) * Math.abs(Number(t?.amount ?? 0));

// what the row adds to the balance
export const countedAmount = (t) => signedAmount(t);

// a total of money in and out, by what the row did to the account:
// a cancelled expense taken back is money that came in
export const addToTotals = (totals, t) => {
  const amount = countedAmount(t);
  if (amount >= 0) totals.in = round2(totals.in + amount);
  else totals.out = round2(totals.out - amount);
  return totals;
};

// the original and its reversal share the id
export const rowKey = (t) => `${t.type}-${t.id}${isReversal(t) ? "-reversal" : ""}`;

// a click on a reversal opens the transaction it takes back
export const originalOf = (t, transactions = []) =>
  isReversal(t)
    ? transactions.find((x) => x.id === t.id && x.type === t.type && !isReversal(x)) ?? t
    : t;

const round2 = (n) => Math.round(n * 100) / 100;

const timeOf = (t) => {
  const time = new Date(t?.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const monthKey = (t) => {
  const d = new Date(timeOf(t));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// newest month first, newest transaction first; totals of money in and out per month
export const groupByMonth = (transactions = []) => {
  const groups = new Map();
  for (const t of [...transactions].sort((a, b) => timeOf(b) - timeOf(a))) {
    const key = monthKey(t);
    if (!groups.has(key)) groups.set(key, { key, items: [], totalIn: 0, totalOut: 0 });
    const g = groups.get(key);
    g.items.push(t);
    const totals = addToTotals({ in: g.totalIn, out: g.totalOut }, t);
    g.totalIn = totals.in;
    g.totalOut = totals.out;
  }
  return [...groups.values()];
};

export const TYPE_FILTERS = {
  all: () => true,
  income: (t) => t.type === "incomse",
  expense: (t) => t.type === "expense",
  transfer: (t) => t.type === "in-transfer" || t.type === "out-transfer" || t.type?.startsWith("transfer-fee"),
  debt: (t) => t.type === "debt-in" || t.type === "debt-out" || t.category === "Debt",
};

// text search over what the row shows: description, category name, account names
export const filterTransactions = (transactions = [], { type = "all", query = "", categoryName, hideCancelled = false } = {}) => {
  const matchesType = TYPE_FILTERS[type] ?? TYPE_FILTERS.all;
  const q = query.trim().toLowerCase();
  return transactions.filter((t) => {
    if (!matchesType(t)) return false;
    if (hideCancelled && isCancelled(t)) return false;
    if (!q) return true;
    const text = [
      t.description,
      categoryName?.(t),
      t.sourceAccount?.name,
      t.destinationAccount?.name,
    ].filter(Boolean).join(" ").toLowerCase();
    return text.includes(q);
  });
};

// the account on the other side of a transfer, seen from the given account
// the row is only a fee paid from or into an account that is neither side
export const isTransferFee = (t) => t?.type === "transfer-fee-in" || t?.type === "transfer-fee-out";

export const otherAccountName = (t) => {
  if (t.type === "out-transfer") return t.destinationAccount?.name;
  if (t.type === "in-transfer") return t.sourceAccount?.name;
  return undefined;
};
