"use client";
import { useState } from "react";
import styles from "../../styles/auth/forgotPassword.module.scss";
import Button from "../../components/btns/Button";
import i18n from "../../configuration/i18n.js";

export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError(i18n.t("forgotPassword.emailRequired", { defaultValue: "Enter your email address" }));
      return;
    }
    setError("");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.header}><p>{i18n.t("forgotPassword.header")}</p></div>
        <div className={styles.lForm}>
          <p className={styles.successMessage}>{i18n.t("forgotPassword.success")} {email}</p>
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
          {error && <span className={styles.error} role="alert">{error}</span>}
          <div className={styles.btnGroup}>
            <Button variant="primary" text={i18n.t("forgotPassword.submit")} type="submit" paddingSize="12px 20px" fontSize="16px" />
          </div>
        </form>
      </div>
    </div>
  );
}