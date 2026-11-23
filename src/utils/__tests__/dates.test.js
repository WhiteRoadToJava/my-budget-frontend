import { describe, it, expect } from "vitest";
import { toCalendarDay, dateFnsLocale, weekStartsOnFor } from "../dates";

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

describe("weekStartsOnFor", () => {
  it("follows the user's choice", () => {
    expect(weekStartsOnFor("SATURDAY", "en")).toBe(6);
    expect(weekStartsOnFor("SUNDAY", "sv")).toBe(0);
    expect(weekStartsOnFor("MONDAY", "ar")).toBe(1);
  });

  it("follows the language when nothing is chosen", () => {
    expect(weekStartsOnFor(null, "sv")).toBe(1);
    expect(weekStartsOnFor(null, "ar")).toBe(6);
    expect(weekStartsOnFor(undefined, "en")).toBe(0);
  });
});
