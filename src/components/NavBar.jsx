import React from 'react'
import styles from "../styles/layout/navbar.module.scss"
import LanguageSelector from './elements/LanguageSelector'

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className={styles.navbarContainer} >
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{user?.firstName + " " + user?.lastName || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  )
}

export default NavBar
