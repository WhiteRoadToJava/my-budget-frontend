// The currencies of an account ("pockets"): the backend sends account.balances =
// [{ currency, openingBalance, totalBalance }]. An account from before the change has
// only currency / balance / totalBalance, which make one pocket.

const round2 = (n) => Math.round(n * 100) / 100;

export const pocketsOf = (account) => {
  if (!account) return [];
  if (Array.isArray(account.balances) && account.balances.length > 0) return account.balances;
  if (!account.currency) return [];
  return [{
    currency: account.currency,
    openingBalance: Number(account.balance ?? 0),
    totalBalance: Number(account.totalBalance ?? account.balance ?? 0),
  }];
};

// the account's first currency: the one used when no currency is given
export const firstCurrency = (account) => account?.currency ?? pocketsOf(account)[0]?.currency ?? "";

export const pocketOf = (account, currency) =>
  pocketsOf(account).find((p) => p.currency === currency) ?? null;

export const hasCurrency = (account, currency) => pocketOf(account, currency) !== null;

// the currency a row of a transaction list is in (rows from before the change: their account's)
export const transactionCurrency = (t) => t?.currency ?? t?.sourceAccount?.currency ?? "";

export const changeSinceOpeningOf = (pocket) =>
  round2(Number(pocket?.totalBalance ?? 0) - Number(pocket?.openingBalance ?? 0));

// the currency asked for (e.g. in the address) when the account has it, else its first one
export const chosenCurrency = (account, wanted) => {
  const code = (wanted ?? "").toUpperCase();
  return hasCurrency(account, code) ? code : firstCurrency(account);
};

// currencies that can still be added
export const currenciesToAdd = (all = [], account) => {
  const taken = new Set(pocketsOf(account).map((p) => p.currency));
  return all.filter((c) => !taken.has(c));
};
