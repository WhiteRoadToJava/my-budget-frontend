import { describe, it, expect, vi, beforeEach } from "vitest";

// the real axios instance is replaced: we only check what is sent where
const post = vi.fn();
vi.mock("../axios", () => ({ default: { post: (...args) => post(...args) } }));

import { resetPassword, forgotPassword, updatePassword, activateAccount } from "../authService";

// braces matter: a function returned from beforeEach runs as the clean-up after each test
beforeEach(() => {
  post.mockReset();
});

// an axios-like error: an Error with the server answer in .response
const httpError = (status, data) => Object.assign(new Error(`HTTP ${status}`), { response: { status, data } });

// the error the call threw, or null when it did not throw
const thrownBy = async (call) => {
  try {
    await call();
    return null;
  } catch (error) {
    return error;
  }
};

describe("authService", () => {
  it("saves a new password on /auth/reset-password", async () => {
    post.mockResolvedValue({ data: { message: "Password updated successfully" } });
    const data = await resetPassword("TOKEN", "New-pass1!", "New-pass1!");
    expect(post).toHaveBeenCalledWith("/auth/reset-password", {
      token: "TOKEN", newPassword: "New-pass1!", confirmPassword: "New-pass1!",
    });
    expect(data).toEqual({ message: "Password updated successfully" });
  });

  it("lets the page see a failed reset (expired link, weak password)", async () => {
    post.mockImplementation(async () => { throw httpError(400, { code: "TOKEN_EXPIRED" }); });
    const error = await thrownBy(() => resetPassword("OLD", "New-pass1!", "New-pass1!"));
    expect(error?.response?.data?.code).toBe("TOKEN_EXPIRED");
  });

  it("asks for a reset email on /auth/forgot-password", async () => {
    post.mockResolvedValue({ data: {} });
    await forgotPassword("ali@x.com", "ar");
    expect(post).toHaveBeenCalledWith("/auth/forgot-password", { username: "ali@x.com", language: "ar" });
  });

  it("does not hide a failed password change", async () => {
    post.mockImplementation(async () => { throw httpError(400, { message: "Wrong password" }); });
    const error = await thrownBy(() => updatePassword({}));
    expect(error?.response?.status).toBe(400);
  });

  it("activates an account on /auth/activate", async () => {
    post.mockResolvedValue({ data: {} });
    await activateAccount("T");
    expect(post).toHaveBeenCalledWith("/auth/activate", { token: "T" });
  });
});
