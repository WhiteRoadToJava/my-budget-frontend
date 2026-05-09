import React from 'react'
import styles from "../styles/layout/navbar.module.scss"
import LanguageSelector from './elements/LanguageSelector'

const NavBar = () => {
  return (
    <div className={styles.navbarContainer}>
      <LanguageSelector />
    </div>
  )
}

export default NavBar
