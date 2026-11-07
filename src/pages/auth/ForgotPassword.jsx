import React from 'react'
import AuthLanguageBar from "../../components/auth/AuthLanguageBar";
import ForgotPasswordComponent from '../../components/auth/ForgotPasswordComponent.jsx'
import styles from "../../styles/pages/auth/forgotPassword.module.scss";  // using login styles for now

const ForgotPassword = () => {
  return (
    <div className={styles.authLayout}>
      <AuthLanguageBar />
      <ForgotPasswordComponent />
    </div>
  )
}

export default ForgotPassword
