import React from 'react'
import LoginComponent from '../../components/auth/LoginComponent'
import styles from "../../styles/pages/auth/login.module.scss";

const Login = () => {
  return (
    <div className={styles.authLayout}>
      <LoginComponent />
    </div>
  )
}

export default Login
