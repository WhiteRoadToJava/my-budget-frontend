import { describe, it, expect } from "vitest";
import validteUpdateUser from "../validteUpdateUser.js";

const validProfile = {
  firstname: "Jane",
  lastname: "Doe",
  phone: "1234567890",
};

// This validator throws a plain object (not an Error) on failure, so we
// catch it manually instead of using vitest's `.toThrow()` matcher, which
// is designed around Error instances.
function getThrown(profile) {
  try {
    validteUpdateUser(profile);
    return null;
  } catch (err) {
    return err;
  }
}

describe("validteUpdateUser", () => {
  it("does not throw for a fully valid profile", () => {
    expect(() => validteUpdateUser(validProfile)).not.toThrow();
  });

  it("throws when first name is missing", () => {
    const thrown = getThrown({ ...validProfile, firstname: "" });
    expect(thrown).not.toBeNull();
    expect(thrown.hasError).toBe(true);
    expect(thrown.position).toBe("firstname");
  });

  it("throws when last name is missing", () => {
    const thrown = getThrown({ ...validProfile, lastname: "" });
    expect(thrown).not.toBeNull();
    expect(thrown.hasError).toBe(true);
    expect(thrown.position).toBe("lastname");
  });

  it("throws when phone is missing", () => {
    const thrown = getThrown({ ...validProfile, phone: "" });
    expect(thrown).not.toBeNull();
    expect(thrown.hasError).toBe(true);
    expect(thrown.position).toBe("phone");
  });
});
