"use client";
import styles from "../../styles/auth/login.module.scss";
import LoginTerminal from "./LoginTerminal";
//import Eye from "src/components/icons/Eye";
import Button from "../../components/btns/Button";
import { useState } from "react";

import {Link} from "react-router-dom";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";

export default function LoginComponent() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Simulate an API call
      console.log("Submitting user data:", user);
      // Here you would typically handle the API response and update the UI accordingly
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className={styles.formContainer}>
      <div className={styles.terminal}>
        <LoginTerminal />
      </div>

      <div className={styles.header}>
        <p>Please enter your details</p>
      </div>
      <div className={styles.lForm}>
        <form className={styles.form} >
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={handleInputChange}
            name="email"
          />
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={user.password}
            name="password" 
            onChange={handleInputChange}
          />
          <Link href="/auth/forgot" className={styles.forgotPassword}>Forgot password?</Link>
          {errorMessage &&
            <p className={styles.errorMessage}>
              {errorMessage}
            </p>
          }
          {isLoading ? (
            <div className={styles.spinner}>
              <LoadingSpinner />
            </div>
          ) : (
            <div className={styles.btnGroup}>
              <Button
                variant="primary"
                text="Log in"
                type="submit"
                paddingSize="7px 145px"
                fontSize="16px"
                onClick={handleSubmit}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
