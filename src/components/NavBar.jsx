import React from "react";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import { UserContext } from "../contexts/UserContext";

const NavBar = ({ profiles }) => {
console.log("profi  ",profiles);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{profiles?.data?.fullname || profiles?.firstname || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  );
};

export default NavBar;
