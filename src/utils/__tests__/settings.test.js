import { describe, it, expect } from "vitest";
import { validatePasswordChange, validateProfile } from "../user/settings";

describe("validateProfile", () => {
  it("needs a first and a last name", () => {
    expect(validateProfile({ firstname: " ", lastname: "Ali" })?.field).toBe("firstname");
    expect(validateProfile({ firstname: "Sara", lastname: "" })?.field).toBe("lastname");
  });

  it("takes an empty phone or a plausible number", () => {
    expect(validateProfile({ firstname: "Sara", lastname: "Ali", phone: "" })).toBeNull();
    expect(validateProfile({ firstname: "Sara", lastname: "Ali", phone: "+46 70-123 45 67" })).toBeNull();
    expect(validateProfile({ firstname: "Sara", lastname: "Ali", phone: "abc" })?.field).toBe("phone");
  });
});

describe("validatePasswordChange", () => {
  const ok = { currentPassword: "Old-pass1", newPassword: "New-pass1", confirmPassword: "New-pass1" };

  it("accepts a strong new password that is confirmed", () => {
    expect(validatePasswordChange(ok)).toBeNull();
  });

  it("finds the first problem", () => {
    expect(validatePasswordChange({ ...ok, currentPassword: "" })?.field).toBe("currentPassword");
    expect(validatePasswordChange({ ...ok, newPassword: "short", confirmPassword: "short" })?.key)
      .toBe("settings.security.weak");
    expect(validatePasswordChange({ ...ok, newPassword: "Old-pass1", confirmPassword: "Old-pass1" })?.key)
      .toBe("settings.security.same");
    expect(validatePasswordChange({ ...ok, confirmPassword: "New-pass2" })?.field).toBe("confirmPassword");
  });
});