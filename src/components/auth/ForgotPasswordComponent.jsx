"use client";
import { useState } from "react";
import styles from "../../styles/auth/forgotPassword.module.scss";  // using login styles for now
import Button from "../../components/btns/Button";
import { Link } from "react-router-dom";
import i18n from "../../configuration/i18n.js";



export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };


  if (isSubmitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <p>{i18n.t("forgotPassword.header")}</p>
        </div>
        <div className={styles.lForm}>
          <p>{i18n.t("forgotPassword.success")} {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <p>{i18n.t("forgotPassword.header")}</p>
      </div>
      <div className={styles.lForm}>
        <form className={styles.form} >
          <input
            className={styles.input}
            type="email"
            placeholder={i18n.t("forgotPassword.email")}
            value={email}
            onChange={handleChange}
            name="email"
          />
          {error && <span className={styles.error}>{error}</span>}
          <div className={styles.btnGroup}>
            <Button
              variant="primary"
              text={i18n.t("forgotPassword.submit")}
              type="submit"
              paddingSize="5px 50px"
              fontSize="16px"
            />
          </div>
        </form>
      </div>
    </div>
  );
}