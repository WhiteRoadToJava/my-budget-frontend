// Totals for the debts list, grouped by currency (amounts in different
// currencies cannot be added together).
// owedByMe:  what I still have to pay   (direction OWED_BY_ME)
// owedToMe:  what others still owe me   (direction OWED_TO_ME)
// net:       owedToMe - owedByMe; positive means I am owed more than I owe
const round2 = (n) => Math.round(n * 100) / 100;

export const remainingOf = (debt) => Number(debt?.summary?.totalOwed ?? 0);

export const isSettled = (debt) => remainingOf(debt) <= 0;

export const summarizeDebts = (debts = []) => {
  const byCurrency = {};
  for (const debt of debts) {
    const currency = debt.currency || "—";
    const totals = (byCurrency[currency] ??= { currency, owedByMe: 0, owedToMe: 0, net: 0, open: 0 });
    const remaining = remainingOf(debt);
    if (debt.direction === "OWED_BY_ME") totals.owedByMe += remaining;
    if (debt.direction === "OWED_TO_ME") totals.owedToMe += remaining;
    if (remaining > 0) totals.open += 1;
  }
  return Object.values(byCurrency)
    .map((t) => ({
      ...t,
      owedByMe: round2(t.owedByMe),
      owedToMe: round2(t.owedToMe),
      net: round2(t.owedToMe - t.owedByMe),
    }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
};

// open debts first (largest remaining first), settled ones at the end by name
export const sortDebts = (debts = []) =>
  [...debts].sort((a, b) => {
    const settledA = isSettled(a);
    const settledB = isSettled(b);
    if (settledA !== settledB) return settledA ? 1 : -1;
    if (!settledA) return remainingOf(b) - remainingOf(a);
    return (a.name || "").localeCompare(b.name || "");
  });

export const filterDebts = (debts = [], filter = "ALL") =>
  filter === "ALL" ? debts : debts.filter((d) => d.direction === filter);
