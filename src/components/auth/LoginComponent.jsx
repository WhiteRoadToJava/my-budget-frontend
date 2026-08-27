"use client";
import styles from "../../styles/auth/login.module.scss";
import LoginTerminal from "./LoginTerminal";
import Button from "../../components/btns/Button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import i18n from "../../configuration/i18n.js";

export default function LoginComponent() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const { login, currentUser, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  useEffect(() => {
    if (currentUser) {
      setIsLoading(loading);
      const role = currentUser.roles?.[0];
      switch (role) {
        case "ADMIN": navigation("/admin"); break;
        case "USER": navigation("/user"); break;
        default: navigation("/admin/dashboard");
      }
    }
    setIsLoading(loading);
  }, [currentUser, loading, navigation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      await login(user);
    } catch (error) {
      setErrorMessage("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.terminal}><LoginTerminal /></div>
      <div className={styles.header}><p>{i18n.t("login.header")}</p></div>
      <div className={styles.lForm}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} type="text" placeholder={i18n.t("login.username")} value={user.username} onChange={handleInputChange} name="username" autoComplete="username" required />
          <input className={styles.input} type="password" placeholder={i18n.t("login.password")} value={user.password} name="password" onChange={handleInputChange} autoComplete="current-password" required />
          <Link to="/auth/forgot-password" className={styles.forgotPassword}>{i18n.t("login.forgotPassword")}</Link>
          {errorMessage && <p className={styles.errorMessage} role="alert">{errorMessage}</p>}
          {isLoading ? (
            <div className={styles.spinner}><LoadingSpinner /></div>
          ) : (
            <div className={styles.btnGroup}>
              <Button variant="primary" text={i18n.t("login.submit")} type="submit" paddingSize="12px 20px" fontSize="16px" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}