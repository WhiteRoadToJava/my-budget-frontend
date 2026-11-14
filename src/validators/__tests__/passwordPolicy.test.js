import { describe, it, expect } from "vitest";
import {
  isStrongPassword,
  getPasswordChecks,
} from "../passwordPolicy.js";

describe("passwordPolicy", () => {
  it("accepts a password that satisfies every rule", () => {
    expect(isStrongPassword("NewPass@1234")).toBe(true);
  });

  it("rejects passwords that break a single rule", () => {
    expect(isStrongPassword("Sh@rt1")).toBe(false); // too short
    expect(isStrongPassword("lowercase@123")).toBe(false); // no uppercase
    expect(isStrongPassword("NoNumber@abc")).toBe(false); // no digit
    expect(isStrongPassword("NoSpecial1234")).toBe(false); // no special character
  });

  it("treats a missing password as weak", () => {
    expect(isStrongPassword()).toBe(false);
    expect(isStrongPassword("")).toBe(false);
  });

  it("reports each rule separately", () => {
    expect(getPasswordChecks("abc")).toEqual({
      length: false,
      uppercase: false,
      number: false,
      special: false,
    });
    expect(getPasswordChecks("Abcdefg1!")).toEqual({
      length: true,
      uppercase: true,
      number: true,
      special: true,
    });
  });
});
