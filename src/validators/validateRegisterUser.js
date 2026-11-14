import { isStrongPassword } from "./passwordPolicy.js";

export const validateRegisterUser = (profile) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. فحص إذا كان فارغاً أولاً
  if (!profile.username || !profile.username.trim()) {
    return {
      hasError: true,
      message: "Username is required",
      position: "username",
    };
  }

  // 2. فحص مطابقة الإيميل
  if (!emailRegex.test(profile.username)) {
    return {
      hasError: true,
      message: "Username is not match an email type",
      position: "username",
    };
  }

  // 3. فحص كلمة المرور
  if (!profile.password || !profile.password.trim()) {
    return {
      hasError: true,
      message: "The password can not be empty.",
      position: "password",
    };
  }

  // 3b. قوة كلمة المرور (نفس شروط الباك إند)
  if (!isStrongPassword(profile.password)) {
    return {
      hasError: true,
      message:
        "Password must be at least 8 characters and include an uppercase letter, a number and a special character",
      position: "password",
    };
  }

  // 4. الاسم الأول
  if (!profile.firstname || !profile.firstname.trim()) {
    return {
      hasError: true,
      message: "First name is required",
      position: "firstname",
    };
  }

  // 5. الاسم الأخير
  if (!profile.lastname || !profile.lastname.trim()) {
    return {
      hasError: true,
      message: "Last name is required",
      position: "lastname",
    };
  }

  // 6. رقم الهاتف
  if (!profile.phone || !profile.phone.trim()) {
    return {
      hasError: true,
      message: "Phone number is required",
      position: "phone",
    };
  }

  return { hasError: false, message: "", position: "" };
};
