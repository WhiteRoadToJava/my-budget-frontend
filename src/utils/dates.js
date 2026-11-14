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
