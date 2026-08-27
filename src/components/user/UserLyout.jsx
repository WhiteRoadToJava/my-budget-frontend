import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { getUserMenuItems } from "../../utils/user/getUserMenuItem.jsx";
import i18n from "../../configuration/i18n.js";
import NavBar from "../NavBar.jsx";
import styles from "../../styles/layout/layout.module.scss";

const UserLayout = () => {
  const [menuItems, setMenuItems] = useState(getUserMenuItems());
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("profiles")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleLanguageChange = () => setMenuItems(getUserMenuItems());
    const handleProfileChange = () => {
      try {
        setProfile(JSON.parse(localStorage.getItem("profiles")) || null);
      } catch {
        setProfile(null);
      }
    };

    i18n.on("languageChanged", handleLanguageChange);
    window.addEventListener("storage", handleProfileChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      window.removeEventListener("storage", handleProfileChange);
    };
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Sidebar menuItems={menuItems} />
      </aside>
      <div className={styles.bodyLayout}>
        <div className={styles.content}>
          <header className={styles.topContent}>
            <NavBar profiles={profile} />
          </header>
          <main className={styles.mainContent}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;