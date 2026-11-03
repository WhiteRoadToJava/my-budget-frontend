// Recurring debt payments are schedules of type DEBT_PAYMENT linked by debtId.
import { format } from "date-fns";

export const SCHEDULE_INTERVALS = [
  { value: "DAILY", label: "debts.intervalDaily" },
  { value: "WEEKLY", label: "debts.intervalWeekly" },
  { value: "MONTHLY", label: "debts.intervalMonthly" },
  { value: "YEARLY", label: "debts.intervalYearly" },
];

export const intervalLabelKey = (value) =>
  SCHEDULE_INTERVALS.find((i) => i.value === value)?.label;

export const debtSchedulesOf = (schedules = [], debtId) =>
  schedules.filter((s) => s.transactionType === "DEBT_PAYMENT" && s.debtId === debtId);

// the backend stops a payment schedule itself when the debt is settled
export const paymentStatusKey = (schedule, debt) => {
  if (schedule.isActive !== false) return "scheduleInfo.active";
  return Number(debt?.summary?.totalOwed ?? 0) <= 0 ? "debts.paymentFinished" : "scheduleInfo.paused";
};

const todayString = (today) => format(today, "yyyy-MM-dd");

export const emptyPaymentForm = (today = new Date()) => ({
  amount: "",
  interval: "MONTHLY",
  firstDate: todayString(today),
  accountId: "",
  description: "",
});

export const validatePaymentForm = (form, today = new Date()) => {
  const amount = Number(form.amount);
  if (form.amount === "" || Number.isNaN(amount) || amount <= 0) {
    return "debts.validation.amountPositive";
  }
  if (!form.interval) return "debts.validation.intervalRequired";
  if (!form.firstDate) return "debts.validation.dateRequired";
  // a date in the past would make the backend pay every missed period, one per day
  if (form.firstDate < todayString(today)) return "debts.validation.noPastDate";
  if (!form.accountId) return "debts.validation.accountRequired";
  return null;
};

// shape expected by POST /user/schedules/excute; the backend sets category "Debt"
export const formToScheduleRequest = (form, debt) => ({
  name: debt.name,
  description: form.description.trim(),
  sourceAccountId: form.accountId,
  debtId: debt.id,
  transactionTypes: ["DEBT_PAYMENT"],
  scheduleIntervals: [form.interval],
  amountSend: Number(form.amount),
  nextExecutionDate: `${form.firstDate}T00:00:00.000Z`,
  isActive: true,
});
