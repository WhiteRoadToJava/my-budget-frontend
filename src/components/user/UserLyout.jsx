// UserLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { getUserMenuItems } from "../../utils/user/getUserMenuItem.jsx";
import i18n from "../../configuration/i18n.js";
import NavBar from "../NavBar.jsx";

const UserLayout =  ()  => {
  const [menuItems, setMenuItems] = useState(getUserMenuItems);
  const [profile, setProfile] = useState(localStorage.getItem("profiles"));

  useEffect(() => {
    const handleLanguageChange = () => {
      setMenuItems(getUserMenuItems());
    };
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange); // cleanup
  }, []);

      useMemo(() => {
      setProfile(JSON.parse(localStorage.getItem("profiles")));
    },[localStorage.getItem("profiles")]);


  console.log( "navebar profile ",profile);
  return (
    <>
      {" "}
      <NavBar profiles={profile} />
      <div style={{ display: "flex" }}>
        <Sidebar menuItems={menuItems} />
        <main className="content-area" style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default UserLayout;
