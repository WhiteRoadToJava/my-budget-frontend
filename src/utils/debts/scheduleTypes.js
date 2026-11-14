// labels for the schedule types sent by the backend
const SCHEDULE_TYPES = {
  INCOMSE: "scheduleInfo.typeIncome",
  EXPENSE: "scheduleInfo.typeExpense",
  TRANSFER: "scheduleInfo.typeTransfer",
  DEBT_PAYMENT: "scheduleInfo.typeDebtPayment",
};

// unknown types fall back to the raw value (i18next returns the key itself)
export const scheduleTypeKey = (type) => SCHEDULE_TYPES[type] ?? String(type ?? "");
