import React from 'react'
import RegisterComponent from '../../components/auth/RegisterComponent.jsx'
import styles from "../../styles/pages/auth/register.module.scss";

const Register = () => {
  return (
    <div className={styles.authLayout}>
      <RegisterComponent />
    </div>
  )
}

export default Register
