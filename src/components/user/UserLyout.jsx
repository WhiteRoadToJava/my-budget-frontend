import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { getUserMenuItems } from "../../utils/user/getUserMenuItem.jsx"

const   UserLyout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={getUserMenuItems} />

      <main className="content-area" style={{ flex: 1, padding: "20px" }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default UserLyout;
