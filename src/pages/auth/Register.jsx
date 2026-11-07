import React from 'react'
import AuthLanguageBar from "../../components/auth/AuthLanguageBar";
import RegisterComponent from '../../components/auth/RegisterComponent.jsx'
import styles from "../../styles/pages/auth/register.module.scss";

const Register = () => {
  return (
    <div className={styles.authLayout}>
      <AuthLanguageBar />
      <RegisterComponent />
    </div>
  )
}

export default Register
