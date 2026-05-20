import React, { useEffect, useState } from "react";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import { UserContext } from "../contexts/UserContext";

const NavBar = () => {
  const profiles = JSON.parse(localStorage.getItem("profiles"));

  const [fullname, setFullname] = useState(profiles?.date?.fullname);
  

  useEffect(() => {
    if (profiles) {
      setFullname(profiles?.date?.data.fullname || profiles?.fullname);
    
    }
  }, [profiles]);


  return (
    <div className={styles.navbarContainer}>
      <div className={styles.userContainer}>
        <p>Wecome Back:</p>
        <h2>{fullname || "Guest"}</h2>
      </div>
      <LanguageSelector />
    </div>
  );
};

export default NavBar;
