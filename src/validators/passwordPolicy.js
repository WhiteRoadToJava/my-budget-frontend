// Same rules as the backend (ResetPasswordRequest.newPassword / RegisterRequest.password):
// at least 8 characters, one uppercase letter (A-Z), one digit and one special character.
export const PASSWORD_POLICY_REGEX =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.{8,}).*$/;

export const isStrongPassword = (password = "") =>
  PASSWORD_POLICY_REGEX.test(password);

// One boolean per rule, used for the live checklist under the password field.
export const getPasswordChecks = (password = "") => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*()\-_=+{};:,<.>]/.test(password),
});
