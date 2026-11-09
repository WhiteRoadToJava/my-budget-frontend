import { pocketsOf } from "./pockets";
// Pure helpers for the accounts page: split, search, totals and change since opening.

export const isArchived = (account) =>
  Array.isArray(account?.status) && account.status.includes("ARCHIVED");

const byCurrencyThenName = (a, b) =>
  (a.currency || "").localeCompare(b.currency || "") || (a.name || "").localeCompare(b.name || "");

export const splitAccounts = (accounts = []) => {
  const active = [];
  const archived = [];
  for (const account of accounts) (isArchived(account) ? archived : active).push(account);
  return { active: active.sort(byCurrencyThenName), archived: archived.sort(byCurrencyThenName) };
};

export const searchAccounts = (accounts = [], query = "") => {
  const q = query.trim().toLowerCase();
  if (!q) return accounts;
  return accounts.filter(
    (a) => (a.name || "").toLowerCase().includes(q) || (a.currency || "").toLowerCase().includes(q),
  );
};

const round2 = (n) => Math.round(n * 100) / 100;

// totals of the given accounts per currency (different currencies can not be added)
export const totalsByCurrency = (accounts = []) => {
  const totals = {};
  // every currency of every account
  for (const a of accounts) {
    for (const p of pocketsOf(a)) {
      const currency = p.currency || "—";
      totals[currency] = round2((totals[currency] ?? 0) + Number(p.totalBalance ?? 0));
    }
  }
  return Object.entries(totals)
    .map(([currency, total]) => ({ currency, total }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
};

// how much the account moved since it was opened (balance is the opening balance)
export const changeSinceOpening = (account) =>
  round2(Number(account?.totalBalance ?? 0) - Number(account?.balance ?? 0));
