import React, { useContext } from 'react'
import styles from "../styles/layout/navbar.module.scss"
import LanguageSelector from './elements/LanguageSelector'
import { UserContext } from '../contexts/UserContext';


const NavBar = () => {

  const {userProvider} = useContext(UserContext);
  console.log("userProvider", userProvider)


  return (
    <div className={styles.navbarContainer} >
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{userProvider?.firstName + " " + userProvider?.lastName || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  )
}

export default NavBar
