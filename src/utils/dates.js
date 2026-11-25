// Calendar-day helpers. The backend sends dates as "yyyy-MM-dd" or as
// "yyyy-MM-ddT00:00:00(.000Z)". new Date() reads those as UTC midnight, which is
// the previous day west of UTC. Only the day part matters, so read it as a local day.
import { parseISO } from "date-fns";
import { ar, enUS, sv } from "date-fns/locale";

export const toCalendarDay = (value) => {
  if (!value) return null;
  const day = parseISO(String(value).slice(0, 10));
  return Number.isNaN(day.getTime()) ? null : day;
};

// date-fns locale for month and weekday names
export const dateFnsLocale = (language) => ({ ar, sv }[language] ?? enUS);

// date-fns weekStartsOn (0 = Sunday, 1 = Monday, 6 = Saturday): the user's choice,
// else what the language uses
const WEEK_STARTS = { SUNDAY: 0, MONDAY: 1, SATURDAY: 6 };
export const weekStartsOnFor = (firstDayOfWeek, language) =>
  WEEK_STARTS[firstDayOfWeek] ?? dateFnsLocale(language).options?.weekStartsOn ?? 1;
