import { format } from "date-fns";

export const todayString = (now = new Date()) => format(now, "yyyy-MM-dd");

export const isFutureDay = (day, now = new Date()) =>
  Boolean(day) && day > todayString(now);

export const createdAtFor = (day, now = new Date()) =>
  !day || day === todayString(now)
    ? undefined
    : `${day}T${format(now, "HH:mm:ss")}`;