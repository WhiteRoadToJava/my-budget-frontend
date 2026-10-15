"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/register.module.scss";
import activation from "../../styles/auth/activation.module.scss";
import Button from "../../components/btns/Button";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";
import ResendActivation from "./ResendActivation.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { validateRegisterUser } from "../../validators/validateRegisterUser.js";
import i18n from "../../configuration/i18n.js";

const initialProfile = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  phone: "",
};

export default function RegisterComponent() {
  const [profile, setProfile] = useState(initialProfile);
  const [fieldError, setFieldError] = useState({ position: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // set after a successful registration: we show "check your email" instead of the form
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    // امسح رسالة الخطأ فور ما المستخدم يبدأ يعدّل الحقل اللي غلط فيه
    if (fieldError.position === name) {
      setFieldError({ position: "", message: "" });
    }
  };

  const inputClass = (name) =>
    `${styles.input} ${fieldError.position === name ? styles.inputError : ""}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validation = validateRegisterUser(profile);
    if (validation.hasError) {
      setFieldError({ position: validation.position, message: validation.message });
      return;
    }
    setFieldError({ position: "", message: "" });

    // the backend DTO uses firstName / lastName (camelCase), the form uses firstname / lastname
    const payload = {
      username: profile.username.trim(),
      password: profile.password,
      firstName: profile.firstname.trim(),
      lastName: profile.lastname.trim(),
      phone: profile.phone.trim(),
      language: i18n.language || "en",
    };

    setIsLoading(true);
    try {
      await register(payload);
      setRegisteredEmail(payload.username);
    } catch (error) {
      // the backend answers with a plain string (409, 400) or with { message }
      const data = error.response?.data;
      const serverMessage = typeof data === "string" ? data : data?.message;
      setErrorMessage(
        serverMessage ||
          i18n.t("register.genericError", { defaultValue: "Registration failed. Please try again." })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className={activation.formContainer}>
        <div className={activation.header}>
          <p>{i18n.t("activation.checkEmailTitle")}</p>
        </div>
        <p className={activation.message}>
          {i18n.t("activation.checkEmailText")} <strong>{registeredEmail}</strong>
        </p>
        <p className={activation.hint}>{i18n.t("activation.checkEmailSpam")}</p>
        <ResendActivation email={registeredEmail} />
        <p className={activation.loginLink}>
          <Link to="/auth/login">{i18n.t("activation.backToLogin")}</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <p>{i18n.t("register.header")}</p>
      </div>
      <div className={styles.lForm}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div>
              <input
                className={inputClass("firstname")}
                type="text"
                placeholder={i18n.t("register.firstname")}
                value={profile.firstname}
                onChange={handleInputChange}
                name="firstname"
                autoComplete="given-name"
              />
              {fieldError.position === "firstname" && (
                <p className={styles.fieldError} role="alert">{fieldError.message}</p>
              )}
            </div>
            <div>
              <input
                className={inputClass("lastname")}
                type="text"
                placeholder={i18n.t("register.lastname")}
                value={profile.lastname}
                onChange={handleInputChange}
                name="lastname"
                autoComplete="family-name"
              />
              {fieldError.position === "lastname" && (
                <p className={styles.fieldError} role="alert">{fieldError.message}</p>
              )}
            </div>
          </div>

          <input
            className={inputClass("username")}
            type="email"
            placeholder={i18n.t("register.email")}
            value={profile.username}
            onChange={handleInputChange}
            name="username"
            autoComplete="email"
          />
          {fieldError.position === "username" && (
            <p className={styles.fieldError} role="alert">{fieldError.message}</p>
          )}

          <input
            className={inputClass("phone")}
            type="tel"
            placeholder={i18n.t("register.phone")}
            value={profile.phone}
            onChange={handleInputChange}
            name="phone"
            autoComplete="tel"
          />
          {fieldError.position === "phone" && (
            <p className={styles.fieldError} role="alert">{fieldError.message}</p>
          )}

          <input
            className={inputClass("password")}
            type="password"
            placeholder={i18n.t("register.password")}
            value={profile.password}
            onChange={handleInputChange}
            name="password"
            autoComplete="new-password"
          />
          {fieldError.position === "password" && (
            <p className={styles.fieldError} role="alert">{fieldError.message}</p>
          )}

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">{errorMessage}</p>
          )}

          {isLoading ? (
            <div className={styles.spinner}><LoadingSpinner /></div>
          ) : (
            <div className={styles.btnGroup}>
              <Button
                variant="primary"
                text={i18n.t("register.submit")}
                type="submit"
                paddingSize="12px 20px"
                fontSize="16px"
              />
            </div>
          )}

          <p className={styles.loginLink}>
            {i18n.t("register.haveAccount")}{" "}
            <Link to="/auth/login">{i18n.t("register.loginLink")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
