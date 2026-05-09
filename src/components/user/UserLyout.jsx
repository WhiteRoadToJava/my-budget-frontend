// UserLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { getUserMenuItems } from "../../utils/user/getUserMenuItem.jsx";
import i18n from "../../configuration/i18n.js";

const UserLayout = () => {
  const [menuItems, setMenuItems] = useState(getUserMenuItems); 

  useEffect(() => {
    const handleLanguageChange = () => {
      setMenuItems(getUserMenuItems()); 
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange); // cleanup
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={menuItems} />
      <main className="content-area" style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;