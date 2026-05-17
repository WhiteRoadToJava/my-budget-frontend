import React from 'react'
import styles from "../styles/layout/navbar.module.scss"
import LanguageSelector from './elements/LanguageSelector'
import { UserContext } from '../contexts/UserContext';


const NavBar = () => {
const  userDetails = JSON.parse(localStorage.getItem("userDetails"))







  return (
    <div className={styles.navbarContainer} >
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{userDetails?.fullname || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  )
}

export default NavBar
