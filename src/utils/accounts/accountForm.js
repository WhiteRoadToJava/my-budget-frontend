// Pure helpers for the "new account" form. Validation returns an i18n key or null.

export const ACCOUNT_CURRENCIES = ["SEK", "EUR", "USD", "GBP", "AED", "SAR", "TRY", "JPY"];

export const ACCOUNT_TYPES = [
  { value: "NORMAL", label: "accountsPage.types.NORMAL", hint: "createAccount.typeNormalHint" },
  { value: "COMPANY", label: "accountsPage.types.COMPANY", hint: "createAccount.typeCompanyHint" },
];

// start with the currency the user already uses most, so the usual case is one click less
export const mostUsedCurrency = (accounts = []) => {
  const counts = {};
  for (const a of accounts) if (a.currency) counts[a.currency] = (counts[a.currency] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "";
};

export const emptyAccountForm = (accounts = []) => ({
  name: "",
  type: "NORMAL",
  currency: mostUsedCurrency(accounts),
  balance: "",
});

export const validateAccountForm = (form, existingAccounts = []) => {
  const name = form.name.trim();
  if (!name) return "messages.nameRequired";
  if (existingAccounts.some((a) => (a.name || "").trim().toLowerCase() === name.toLowerCase())) {
    return "createAccount.errorExists";
  }
  if (!form.type) return "messages.typeRequired";
  if (!form.currency) return "messages.currencyRequired";
  if (form.balance !== "" && Number.isNaN(Number(form.balance))) return "createAccount.balanceInvalid";
  return null;
};

// an empty opening balance means a new, empty account
export const formToAccountRequest = (form) => ({
  name: form.name.trim(),
  type: form.type,
  currency: form.currency,
  balance: form.balance === "" ? 0 : Number(form.balance),
});

// the backend answers "Account already exists" for a duplicate name
export const accountErrorKey = (error) => {
  const text = typeof error?.response?.data === "string" ? error.response.data : "";
  return text.includes("already exists") ? "createAccount.errorExists" : "messages.errorCreateAccount";
};
