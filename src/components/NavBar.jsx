import React from "react";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import i18n from "../configuration/i18n";
import MessageComponent from "../components/interface/MessageComponent";
import Menu from "./icons/interface/Menu";

const NavBar = ({ profiles, onMenuButtonClick }) => {
  const displayName = profiles?.data?.fullname || profiles?.firstname || "Guest";
  const initial = displayName.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className={styles.navbarContainer}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuButtonClick}
        aria-label={i18n.t("sidebar.openMenu")}
      >
        <Menu />
      </button>
      <div className={styles.userContainer}>
        <div className={styles.avatar} aria-hidden="true">{initial}</div>
        <div>
          <p>{i18n.t("greeting.welcome")}:</p>
          <h2>{displayName}</h2>
        </div>
      </div>
      <div className={styles.iconsContainer}>
        <LanguageSelector />
        <MessageComponent />
      </div>
    </div>
  );
};

export default NavBar;