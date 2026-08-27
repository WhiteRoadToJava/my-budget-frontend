import { describe, it, expect } from "vitest";
import { validateRegisterUser } from "../validateRegisterUser.js";

const validProfile = {
  username: "test@example.com",
  password: "secret123",
  firstname: "Jane",
  lastname: "Doe",
  phone: "1234567890",
};

describe("validateRegisterUser", () => {
  it("returns no error for a fully valid profile", () => {
    const result = validateRegisterUser(validProfile);
    expect(result.hasError).toBe(false);
  });

  it("flags a missing username", () => {
    const result = validateRegisterUser({ ...validProfile, username: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("username");
  });

  it("flags a username that is not a valid email", () => {
    const result = validateRegisterUser({ ...validProfile, username: "not-an-email" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("username");
    expect(result.message).toMatch(/email/i);
  });

  it("flags a missing password", () => {
    const result = validateRegisterUser({ ...validProfile, password: "   " });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("password");
  });

  it("flags a missing first name", () => {
    const result = validateRegisterUser({ ...validProfile, firstname: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("firstname");
  });

  it("flags a missing last name", () => {
    const result = validateRegisterUser({ ...validProfile, lastname: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("lastname");
  });

  it("flags a missing phone number", () => {
    const result = validateRegisterUser({ ...validProfile, phone: "" });
    expect(result.hasError).toBe(true);
    expect(result.position).toBe("phone");
  });
});
