import { describe, it, expect } from "vitest";
import { validateUpdatePassword } from "../validateUpdatePassword.JS";

const validRequest = {
  currentPassword: "oldpass1",
  newPassword: "newpass1",
  confirmPassword: "newpass1",
};

describe("validateUpdatePassword", () => {
  it("returns no error for a fully valid request", () => {
    const result = validateUpdatePassword(validRequest);
    expect(result.hasError).toBe(false);
  });

  it("flags a missing current password", () => {
    const result = validateUpdatePassword({ ...validRequest, currentPassword: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("currentPassword");
  });

  it("flags a missing new password", () => {
    const result = validateUpdatePassword({ ...validRequest, newPassword: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("newPassword");
  });

  it("flags a new password shorter than 6 characters", () => {
    const result = validateUpdatePassword({
      ...validRequest,
      newPassword: "abc12",
      confirmPassword: "abc12",
    });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("newPassword");
    expect(result.message).toMatch(/at least 6/i);
  });

  it("flags a missing confirm password", () => {
    const result = validateUpdatePassword({ ...validRequest, confirmPassword: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("confirmPassword");
  });

  it("flags mismatched new and confirm passwords", () => {
    const result = validateUpdatePassword({
      ...validRequest,
      newPassword: "newpass1",
      confirmPassword: "different1",
    });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("confirmPassword");
    expect(result.message).toMatch(/do not match/i);
  });
});
