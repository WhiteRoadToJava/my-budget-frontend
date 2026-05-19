import React from "react";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import { UserContext } from "../contexts/UserContext";

const NavBar = () => {
  const profiles = JSON.parse(localStorage.getItem("profiles"));
  console.log("profiles is", profiles.data);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{profiles?.data.fullname || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  );
};

export default NavBar;
