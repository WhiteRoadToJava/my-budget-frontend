import React, { useEffect, useState } from "react";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import { UserContext } from "../contexts/UserContext";
import i18n from "../configuration/i18n";
import MessageComponent from "../components/interface/MessageComponent";

const NavBar = ({ profiles }) => {


  return (
    <div className={styles.navbarContainer}>
      <div className={styles.userContainer}>
        <p>{i18n.t("greeting.welcome")}:</p>
        <h2>{profiles?.data?.fullname || profiles?.firstname || "Guest"}</h2>
      </div>
      <div className={styles.iconsContainer}>
        <LanguageSelector />
        <MessageComponent />
      </div>
    </div>
  );
};

export default NavBar;
