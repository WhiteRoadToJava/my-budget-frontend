// Helpers for schedule execution dates.
// Dates are handled as calendar days ("YYYY-MM-DD") in UTC so that the user's
// timezone never shifts the day, and are returned in the same format the
// schedule forms send: "YYYY-MM-DDT00:00:00.000Z".

const pad = (n) => String(n).padStart(2, "0");

const toLocalDayString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const daysInMonth = (year, monthIndex) =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

// Adds whole months and keeps the original day when possible
// (Jan 31 + 1 month = Feb 28/29), like Java's LocalDateTime.plusMonths.
const addMonths = (base, months) => {
  const total = base.getUTCMonth() + months;
  const year = base.getUTCFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const day = Math.min(base.getUTCDate(), daysInMonth(year, month));
  return new Date(Date.UTC(year, month, day));
};

const addPeriods = (base, interval, count) => {
  switch (interval) {
    case "DAILY":
      return new Date(base.getTime() + count * 86400000);
    case "WEEKLY":
      return new Date(base.getTime() + count * 7 * 86400000);
    case "MONTHLY":
      return addMonths(base, count);
    case "YEARLY":
      return addMonths(base, count * 12);
    default:
      return null;
  }
};

// When a paused schedule is resumed, a date in the past would make the backend
// run it right away (and catch up one missed period per day). Move the date
// forward by whole intervals until it is today or later instead.
export const rollForwardExecutionDate = (executionDate, interval, today = new Date()) => {
  if (!executionDate) return executionDate;
  const base = new Date(`${String(executionDate).slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(base.getTime())) return executionDate;

  const todayUtc = new Date(`${toLocalDayString(today)}T00:00:00.000Z`);
  let next = base;
  for (let count = 1; next < todayUtc; count++) {
    next = addPeriods(base, interval, count);
    if (!next) return executionDate;
  }
  return next.toISOString();
};