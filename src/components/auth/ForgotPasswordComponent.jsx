"use client";
import { useState } from "react";
import styles from "../../styles/auth/forgotPassword.module.scss";  // using login styles for now
import Button from "../../components/btns/Button";


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
          <p>Check your email</p>
        </div>
        <div className={styles.lForm}>
          <p>A password reset link has been sent to {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <p>Reset your password</p>
      </div>
      <div className={styles.lForm}>
        <form className={styles.form} >
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
          />
          {error && <span className={styles.error}>{error}</span>}
          <div className={styles.btnGroup}>
            <Button
              variant="primary"
              text="Send Reset Link"
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