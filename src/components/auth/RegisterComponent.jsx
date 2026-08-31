"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/register.module.scss";
import Button from "../../components/btns/Button";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";
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
  const navigate = useNavigate();
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

    setIsLoading(true);
    try {
      await register(profile);
      navigate("/user");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          i18n.t("register.genericError", { defaultValue: "Registration failed. Please try again." })
      );
    } finally {
      setIsLoading(false);
    }
  };

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
