import React from 'react'
import AuthLanguageBar from "../../components/auth/AuthLanguageBar";
import LoginComponent from '../../components/auth/LoginComponent'
import styles from "../../styles/pages/auth/login.module.scss";

const Login = () => {
  return (
    <div className={styles.authLayout}>
      <AuthLanguageBar />
      <LoginComponent />
    </div>
  )
}

export default Login
