import { describe, expect, it } from "vitest";
import { createdAtFor, isFutureDay, todayString } from "../transactions/transactionDate";

const now = new Date(2026, 10, 20, 9, 5, 7); // 20 Nov 2026, 09:05:07 local

describe("transactionDate", () => {
  it("gives today as yyyy-MM-dd", () => {
    expect(todayString(now)).toBe("2026-11-20");
  });

  it("sends nothing for today, so the server stamps the moment", () => {
    expect(createdAtFor("2026-11-20", now)).toBeUndefined();
    expect(createdAtFor("", now)).toBeUndefined();
  });

  it("sends an earlier day at the current time", () => {
    expect(createdAtFor("2026-11-03", now)).toBe("2026-11-03T09:05:07");
  });

  it("knows a future day", () => {
    expect(isFutureDay("2026-11-21", now)).toBe(true);
    expect(isFutureDay("2026-11-20", now)).toBe(false);
    expect(isFutureDay("", now)).toBe(false);
  });
});