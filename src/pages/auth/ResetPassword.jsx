

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/btns/Button";
import LoadingSpinner from "../../components/displays/LoadingSpinner.jsx";
import { resetPassword } from "../../api/authService.js";
import { getPasswordChecks, isStrongPassword } from "../../validators/passwordPolicy.js";
import i18n from "../../configuration/i18n.js";
import layout from "../../styles/pages/auth/register.module.scss";
import styles from "../../styles/auth/activation.module.scss";
import form from "../../styles/auth/resetPassword.module.scss";

// form | success | invalid | expired
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(token ? "form" : "invalid");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const checks = getPasswordChecks(newPassword);
  const rules = [
    ["length", "passwordPolicy.length"],
    ["uppercase", "passwordPolicy.uppercase"],
    ["number", "passwordPolicy.number"],
    ["special", "passwordPolicy.special"],
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // checked here first: the link is one-time use, so we only call the API with a valid form
    if (!isStrongPassword(newPassword)) {
      setErrorMessage(i18n.t("resetPassword.weak"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(i18n.t("resetPassword.mismatch"));
      return;
    }

    setIsSaving(true);
    try {
      await resetPassword(token, newPassword, confirmPassword);
      setStatus("success");
    } catch (error) {
      const data = error.response?.data;
      if (data?.code === "TOKEN_EXPIRED") setStatus("expired");
      else if (data?.code === "TOKEN_INVALID") setStatus("invalid");
      else setErrorMessage(typeof data === "string" && data ? data : i18n.t("resetPassword.errorGeneric"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={layout.authLayout}>
      <div className={styles.formContainer}>
        {status === "form" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("resetPassword.header")}</p>
            </div>
            <form className={form.form} onSubmit={handleSubmit} noValidate>
              <input
                className={styles.input}
                type="password"
                name="newPassword"
                placeholder={i18n.t("resetPassword.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <div>
                <p className={form.title}>{i18n.t("passwordPolicy.title")}</p>
                <ul className={form.checklist}>
                  {rules.map(([key, label]) => (
                    <li key={key} className={checks[key] ? form.ok : undefined}>
                      {i18n.t(label)}
                    </li>
                  ))}
                </ul>
              </div>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder={i18n.t("resetPassword.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {errorMessage && (
                <p className={styles.errorMessage} role="alert">{errorMessage}</p>
              )}
              {isSaving ? (
                <div className={styles.spinner}><LoadingSpinner /></div>
              ) : (
                <div className={styles.btnGroup}>
                  <Button
                    variant="primary"
                    text={i18n.t("resetPassword.submit")}
                    type="submit"
                    paddingSize="12px 20px"
                    fontSize="16px"
                  />
                </div>
              )}
            </form>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("resetPassword.successTitle")}</p>
            </div>
            <p className={styles.message}>{i18n.t("resetPassword.successText")}</p>
            <div className={styles.btnGroup}>
              <Button
                variant="primary"
                text={i18n.t("resetPassword.goToLogin")}
                onClick={() => navigate("/auth/login")}
                paddingSize="12px 20px"
                fontSize="16px"
              />
            </div>
          </>
        )}

        {(status === "expired" || status === "invalid") && (
          <>
            <div className={styles.header}>
              <p>{i18n.t(`resetPassword.${status}Title`)}</p>
            </div>
            <p className={styles.message}>{i18n.t(`resetPassword.${status}Text`)}</p>
            <div className={styles.btnGroup}>
              <Button
                variant="primary"
                text={i18n.t("resetPassword.requestNew")}
                onClick={() => navigate("/auth/forgot-password")}
                paddingSize="12px 20px"
                fontSize="16px"
              />
            </div>
          </>
        )}

        {status !== "success" && (
          <p className={styles.loginLink}>
            <Link to="/auth/login">{i18n.t("activation.backToLogin")}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
