export const validateUpdatePassword =  (requestBody) => {
  if (!requestBody.currentPassword?.trim()) {
    return {
      hasError: true,
      message: "Old password is required",
      position: "currentPassword",
    };
  }

  if (!requestBody.newPassword?.trim()) {
    return {
      hasError: true,
      message: "New password is required",
      position: "newPassword",
    };
  }

  if (requestBody.newPassword.length < 6) {
    return {
      hasError: true,
      message: "Password must be at least 6 characters",
      position: "newPassword",
    };
  }

  if (!requestBody.confirmPassword?.trim()) {
    return {
      hasError: true,
      message: "Confirm password is required",
      position: "confirmPassword",
    };
  }

  if (requestBody.newPassword !== requestBody.confirmPassword) {
    return {
      hasError: true,
      message: "Passwords do not match",
      position: "confirmPassword",
    };
  }

  return { hasError: false };
}
