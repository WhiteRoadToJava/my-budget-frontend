import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { getAdminMenuItems } from "../../utils/admin/getAdminMenuItems";
const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={getAdminMenuItems} />

      <main className="content-area" style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
