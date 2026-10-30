import { describe, it, expect } from "vitest";
import { rollForwardExecutionDate } from "../scheduleDates";

const today = new Date(2026, 9, 29); // 29 Oct 2026, local time

describe("rollForwardExecutionDate", () => {
  it("keeps a future date unchanged", () => {
    expect(rollForwardExecutionDate("2026-11-05T00:00:00", "MONTHLY", today)).toBe(
      "2026-11-05T00:00:00.000Z"
    );
  });

  it("keeps today unchanged so the schedule can still run today", () => {
    expect(rollForwardExecutionDate("2026-10-29T00:00:00", "WEEKLY", today)).toBe(
      "2026-10-29T00:00:00.000Z"
    );
  });

  it("moves a past monthly date to the next occurrence", () => {
    expect(rollForwardExecutionDate("2026-07-15T00:00:00", "MONTHLY", today)).toBe(
      "2026-11-15T00:00:00.000Z"
    );
  });

  it("keeps the original day of month after a short month", () => {
    expect(rollForwardExecutionDate("2026-01-31T00:00:00", "MONTHLY", today)).toBe(
      "2026-10-31T00:00:00.000Z"
    );
  });

  it("moves daily, weekly and yearly dates", () => {
    expect(rollForwardExecutionDate("2026-10-20T00:00:00", "DAILY", today)).toBe(
      "2026-10-29T00:00:00.000Z"
    );
    expect(rollForwardExecutionDate("2026-10-01T00:00:00", "WEEKLY", today)).toBe(
      "2026-10-29T00:00:00.000Z"
    );
    expect(rollForwardExecutionDate("2024-03-10T00:00:00", "YEARLY", today)).toBe(
      "2027-03-10T00:00:00.000Z"
    );
  });

  it("returns the input when the date or interval is unusable", () => {
    expect(rollForwardExecutionDate(null, "MONTHLY", today)).toBe(null);
    expect(rollForwardExecutionDate("not-a-date", "MONTHLY", today)).toBe("not-a-date");
    expect(rollForwardExecutionDate("2026-01-01T00:00:00", "ONCE", today)).toBe(
      "2026-01-01T00:00:00"
    );
  });
});