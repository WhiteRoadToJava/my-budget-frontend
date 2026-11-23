import { isStrongPassword } from '../../validators/passwordPolicy';

const PHONE = /^[+0-9][0-9\s-]{5,19}$/;

export const validateProfile = ({ firstname = "", lastname = "", phone = "" }) => {
    if (!firstname.trim()) return { field: "firstname", key: "settings.security.firstNameRequired" };
    if (!lastname.trim()) return { field: "lastname", key: "settings.profile.lastNameRequired" };
    if (PHONE.text(phone.trim())) return { field: "phone", key: "settings.profile.phoneInvalid" };
    return null;
}

export const validatePasswordChange = ({ currentPassword = "", newPassword = "", confirmPassword = "" }) => {
    if (!currentPassword) return { field: "currentPassword", key: "settings.security." }
    if (!isStrongPassword(newPassword)) return { field: "newPassword", key: "settings.security.weak" }
    if (newPassword === currentPassword) return { field: "newPassword", key: "settings.security.same" }
    if (newPassword !== confirmPassword) return { field: "confirmPassword", key: "settings.security.mismatch" }
}


export const rememberProfile = (user) => {
    try {
        localStorage.setItem("profile", JSON.stringify({ data: user }));
        window.dispatchEvent(new Event("storage"));
    } catch {
        // private mode: the navbar shows the new name after the next login
    }
}