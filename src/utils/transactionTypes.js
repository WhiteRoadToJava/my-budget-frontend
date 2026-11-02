// Transaction types sent by the backend and how they are shown.
// debt-in / debt-out are debt movements that did not create an income or
// expense (the debt's "count as income/expense" option was off).
import { DEBT_CATEGORY } from "../assiets/categories/assits";
import i18n from "../configuration/i18n";

const TYPE_LABELS = {
  incomse: "transactionDetails.incomse",
  expense: "transactionDetails.expense",
  "in-transfer": "transactionDetails.inTransfer",
  "out-transfer": "transactionDetails.outTransfer",
  "debt-in": "transactionDetails.debtIn",
  "debt-out": "transactionDetails.debtOut",
};

// the category lists hold English names; the Debt category is translated
export const categoryName = (category) =>
  category?.id === DEBT_CATEGORY ? i18n.t("debts.category") : category?.name;

export const typeLabelKey = (type) => TYPE_LABELS[type];

export const isDebtMovement = (transaction) =>
  transaction?.type === "debt-in" || transaction?.type === "debt-out";

// a debt movement, or the income/expense a debt movement created ("Debt" category);
// these can only be changed from the debt page (the backend answers 409 otherwise)
export const belongsToDebt = (transaction) =>
  isDebtMovement(transaction) || transaction?.category === DEBT_CATEGORY;
