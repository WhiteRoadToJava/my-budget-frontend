import { isStrongPassword } from "../../validators/passwordPolicy.js";

// What the settings forms check before sending. Each check gives the field
// and the translation key of the message, or null when everything is fine.

const PHONE = /^[+0-9][0-9\s-]{5,19}$/;

export const validateProfile = ({ firstname = "", lastname = "", phone = "" }) => {
  if (!firstname.trim()) return { field: "firstname", key: "settings.profile.firstNameRequired" };
  if (!lastname.trim()) return { field: "lastname", key: "settings.profile.lastNameRequired" };
  if (phone.trim() && !PHONE.test(phone.trim())) return { field: "phone", key: "settings.profile.phoneInvalid" };
  return null;
};

export const validatePasswordChange = ({ currentPassword = "", newPassword = "", confirmPassword = "" }) => {
  if (!currentPassword) return { field: "currentPassword", key: "settings.security.currentRequired" };
  if (!isStrongPassword(newPassword)) return { field: "newPassword", key: "settings.security.weak" };
  if (newPassword === currentPassword) return { field: "newPassword", key: "settings.security.same" };
  if (newPassword !== confirmPassword) return { field: "confirmPassword", key: "settings.security.mismatch" };
  return null;
};

// The navbar reads the signed-in user from localStorage ("profiles", saved at login
// as { data: user }); keep it in step after a change and tell the layout.
export const rememberProfile = (user) => {
  try {
    localStorage.setItem("profiles", JSON.stringify({ data: user }));
    window.dispatchEvent(new Event("storage"));
  } catch {
    // private mode: the navbar shows the new name after the next login
  }
};