"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/forgotPassword.module.scss";
import activation from "../../styles/auth/activation.module.scss";
import Button from "../../components/btns/Button";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";
import { forgotPassword } from "../../api/authService.js";
import i18n from "../../configuration/i18n.js";

// same as the backend cooldown between two reset emails
const COOLDOWN_SECONDS = 60;

export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const sendLink = async () => {
    setError("");
    setIsSending(true);
    try {
      // the backend always answers 200, so the screen never reveals if the email exists
      await forgotPassword(email.trim(), i18n.language);
      setIsSubmitted(true);
      setSecondsLeft(COOLDOWN_SECONDS);
    } catch {
      setError(i18n.t("forgotPassword.genericError"));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError(i18n.t("forgotPassword.emailRequired"));
      return;
    }
    sendLink();
  };

  if (isSubmitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.header}><p>{i18n.t("forgotPassword.header")}</p></div>
        <div className={styles.lForm}>
          <p className={styles.successMessage} role="status">
            {i18n.t("forgotPassword.successText", { email: email.trim() })}
          </p>
          <p className={activation.hint}>{i18n.t("forgotPassword.spamHint")}</p>
          <div className={activation.resend}>
            <Button
              variant="secondary"
              text={
                secondsLeft > 0
                  ? i18n.t("forgotPassword.resendWait", { seconds: secondsLeft })
                  : i18n.t("forgotPassword.resend")
              }
              onClick={sendLink}
              disabled={isSending || secondsLeft > 0}
              paddingSize="10px 16px"
              fontSize="15px"
            />
            {error && <p className={activation.errorMessage} role="alert">{error}</p>}
          </div>
          <p className={activation.loginLink}>
            <Link to="/auth/login">{i18n.t("forgotPassword.backToLogin")}</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}><p>{i18n.t("forgotPassword.header")}</p></div>
      <div className={styles.lForm}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} type="email" placeholder={i18n.t("forgotPassword.email")} value={email} onChange={(e) => setEmail(e.target.value)} name="email" autoComplete="email" aria-invalid={Boolean(error)} required />
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          {isSending ? (
            <div className={activation.spinner}><LoadingSpinner /></div>
          ) : (
            <div className={styles.btnGroup}>
              <Button variant="primary" text={i18n.t("forgotPassword.submit")} type="submit" paddingSize="12px 20px" fontSize="16px" />
            </div>
          )}
          <p className={activation.loginLink}>
            <Link to="/auth/login">{i18n.t("forgotPassword.backToLogin")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
