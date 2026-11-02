// Pure helpers for the debt forms: options, conversion to/from the API
// and validation. Validation returns an i18n key (or null) so it mirrors
// the backend rules (DebtService) and can be unit tested.
import { format } from "date-fns";

export const DIRECTIONS = [
  { value: "OWED_BY_ME", label: "debts.owedByMe" },
  { value: "OWED_TO_ME", label: "debts.owedToMe" },
];

export const COMPOUNDINGS = [
  { value: "NONE", label: "debts.compoundingNone" },
  { value: "MONTHLY", label: "debts.compoundingMonthly" },
  { value: "YEARLY", label: "debts.compoundingYearly" },
];

export const MOVEMENT_TYPES = [
  { value: "DISBURSEMENT", label: "debts.disbursement" },
  { value: "REPAYMENT", label: "debts.repayment" },
];

export const todayString = (today = new Date()) => format(today, "yyyy-MM-dd");

// ---------- debt ----------

export const emptyDebtForm = (today = new Date()) => ({
  name: "",
  counterparty: "",
  direction: "OWED_BY_ME",
  currency: "",
  annualRate: "0",
  compounding: "NONE",
  startDate: todayString(today),
  countInflowsAsIncome: false,
  countOutflowsAsExpense: false,
  note: "",
});

export const debtToForm = (debt) => ({
  name: debt.name ?? "",
  counterparty: debt.counterparty ?? "",
  direction: debt.direction,
  currency: debt.currency ?? "",
  annualRate: String(debt.annualRate ?? 0),
  compounding: debt.compounding ?? "NONE",
  startDate: debt.startDate ?? "",
  countInflowsAsIncome: !!debt.countInflowsAsIncome,
  countOutflowsAsExpense: !!debt.countOutflowsAsExpense,
  note: debt.note ?? "",
});

export const formToDebtRequest = (form) => ({
  name: form.name.trim(),
  counterparty: form.counterparty.trim(),
  direction: form.direction,
  currency: form.currency,
  annualRate: Number(form.annualRate || 0),
  compounding: form.compounding,
  startDate: form.startDate,
  countInflowsAsIncome: form.countInflowsAsIncome,
  countOutflowsAsExpense: form.countOutflowsAsExpense,
  note: form.note.trim(),
});

export const validateDebtForm = (form, today = new Date()) => {
  if (!form.name.trim()) return "debts.validation.nameRequired";
  if (!form.direction) return "debts.validation.directionRequired";
  if (!form.currency) return "debts.validation.currencyRequired";
  const rate = Number(form.annualRate);
  if (form.annualRate === "" || Number.isNaN(rate) || rate < 0 || rate > 100) {
    return "debts.validation.rateRange";
  }
  if (!form.startDate) return "debts.validation.startDateRequired";
  if (form.startDate > todayString(today)) return "debts.validation.noFutureDate";
  return null;
};

// ---------- movement ----------

export const emptyMovementForm = (today = new Date()) => ({
  movementType: "REPAYMENT",
  amount: "",
  date: todayString(today),
  accountId: "",
  description: "",
});

export const formToMovementRequest = (form) => ({
  movementType: form.movementType,
  amount: Number(form.amount),
  date: form.date,
  accountId: form.accountId,
  description: form.description.trim(),
});

// remaining = what is owed today (summary.totalOwed); a repayment can not be bigger
export const validateMovementForm = (form, { startDate, remaining } = {}, today = new Date()) => {
  if (!form.movementType) return "debts.validation.typeRequired";
  const amount = Number(form.amount);
  if (form.amount === "" || Number.isNaN(amount) || amount <= 0) {
    return "debts.validation.amountPositive";
  }
  if (!form.date) return "debts.validation.dateRequired";
  if (form.date > todayString(today)) return "debts.validation.noFutureDate";
  if (startDate && form.date < startDate) return "debts.validation.beforeStart";
  if (!form.accountId) return "debts.validation.accountRequired";
  if (form.movementType === "REPAYMENT" && remaining != null && amount > Number(remaining)) {
    return "debts.validation.repaymentTooBig";
  }
  return null;
};

// only active accounts in the currency of the debt can be used (backend rule)
export const usableAccounts = (accounts = [], currency) =>
  accounts.filter(
    (a) =>
      a.currency === currency &&
      !(Array.isArray(a.status) && a.status.includes("ARCHIVED")),
  );

// ---------- backend errors ----------

// The backend answers 400 with an English sentence; turn the known ones
// into translated messages, anything else gets the fallback.
const BACKEND_MESSAGES = [
  ["can not be changed after movements", "debts.validation.lockedAfterMovements"],
  ["is archived", "debts.validation.accountArchived"],
  ["The currency of the account", "debts.validation.currencyMismatch"],
  ["can not be in the future", "debts.validation.noFutureDate"],
  ["The repayment of", "debts.validation.repaymentTooBig"],
  ["before the start", "debts.validation.beforeStart"],
  ["Delete the movements", "debts.errorHasMovements"],
];

export const debtErrorKey = (error, fallbackKey) => {
  const text = typeof error?.response?.data === "string" ? error.response.data : "";
  const match = BACKEND_MESSAGES.find(([part]) => text.includes(part));
  return match ? match[1] : fallbackKey;
};
