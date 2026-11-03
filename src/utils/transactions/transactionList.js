// Pure helpers for transaction lists: direction, grouping by month, filters.

const INCOMING = new Set(["incomse", "in-transfer", "debt-in"]);

export const isIncoming = (t) => INCOMING.has(t?.type);

// amount with the sign of its effect on the account
export const signedAmount = (t) => (isIncoming(t) ? 1 : -1) * Math.abs(Number(t?.amount ?? 0));

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
    const amount = signedAmount(t);
    if (amount >= 0) g.totalIn = round2(g.totalIn + amount);
    else g.totalOut = round2(g.totalOut - amount);
  }
  return [...groups.values()];
};

export const TYPE_FILTERS = {
  all: () => true,
  income: (t) => t.type === "incomse",
  expense: (t) => t.type === "expense",
  transfer: (t) => t.type === "in-transfer" || t.type === "out-transfer",
  debt: (t) => t.type === "debt-in" || t.type === "debt-out" || t.category === "Debt",
};

// text search over what the row shows: description, category name, account names
export const filterTransactions = (transactions = [], { type = "all", query = "", categoryName } = {}) => {
  const matchesType = TYPE_FILTERS[type] ?? TYPE_FILTERS.all;
  const q = query.trim().toLowerCase();
  return transactions.filter((t) => {
    if (!matchesType(t)) return false;
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
export const otherAccountName = (t) => {
  if (t.type === "out-transfer") return t.destinationAccount?.name;
  if (t.type === "in-transfer") return t.sourceAccount?.name;
  return undefined;
};
