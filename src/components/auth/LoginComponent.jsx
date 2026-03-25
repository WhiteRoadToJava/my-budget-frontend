"use client";
import styles from "../../styles/auth/login.module.scss";
import LoginTerminal from "./LoginTerminal";
//import Eye from "src/components/icons/Eye";
import Button from "../../components/btns/Button";
import {  useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";

import {Link, useNavigate} from "react-router-dom";
import LoadingSpinner from "../displays/LoadingSpinner.jsx";
import api from "../../api/axios.js";
import { UserContext } from "../../contexts/UserContext.jsx";

export default function LoginComponent() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const userData = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Here you would typically handle the API response and update the UI accordingly
<<<<<<< Updated upstream
      const response = await api.post("/auth/login", user);
      if (response.status === 200) {        
        navigation("/admin/dashboard");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
=======
      const response = await login(user);
      console.log("Login response:", response); // Debugging line to check the response from login
      if (response) {
        const role = response.roles[0]; // Assuming role is an array and you want the first role
        console.log("User role:", role); // Debugging line to check the role value
        switch (role) {
          case "ADMIN":
            navigation("/admin/");
            break;
          case "USER":
            navigation("/user/");
            break;
          default:
            navigation("/");
        }
>>>>>>> Stashed changes
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    console.log("LoginComponent mounted", userData);
    return () => {
      console.log("LoginComponent unmounted", userData);
    };
  }, []);
;




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
            type="text"
            placeholder="username"
            value={user.username}
            onChange={handleInputChange}
            name="username"
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
          <Link to="/auth/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
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
