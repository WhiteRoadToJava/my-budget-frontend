import React from "react";
import styles from "../../styles/layout/sidebar/sidebarTop.module.scss";
import KlarrLogoIcon from "../icons/logos/KlarrLogoIcon";
import KLogo from "./icons/KLogo.jsx";

export default function SidebarTop({ isOpen }) {
  return (
    <div className={styles.sidebarTop}>
      {isOpen ? (
        <div className={styles.openStyle}>
          <div className={styles.open}>
            <KlarrLogoIcon
              className={styles.logo}
              textColor="white"
              dotColor="#D6FF41"
            />
          </div>
        </div>
      ) : (
        <div className={styles.closedStyle}>
          <KLogo />
        </div>
      )}
    </div>
  );
}