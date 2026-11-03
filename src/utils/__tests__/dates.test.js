import { describe, it, expect } from "vitest";
import { toCalendarDay, dateFnsLocale } from "../dates";

describe("toCalendarDay", () => {
  it.each(["2026-03-10", "2026-03-10T00:00:00", "2026-03-10T00:00:00.000Z"])(
    "reads %s as 10 March in the local time zone",
    (value) => {
      const day = toCalendarDay(value);
      expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([2026, 2, 10]);
    },
  );

  it("returns null for empty or invalid values", () => {
    expect(toCalendarDay("")).toBeNull();
    expect(toCalendarDay(null)).toBeNull();
    expect(toCalendarDay("not a date")).toBeNull();
  });
});

describe("dateFnsLocale", () => {
  it("picks the app languages and falls back to English", () => {
    expect(dateFnsLocale("sv").code).toBe("sv");
    expect(dateFnsLocale("ar").code).toBe("ar");
    expect(dateFnsLocale("xx").code).toBe("en-US");
  });
});
