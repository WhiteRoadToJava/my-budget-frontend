import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import styles from "../../styles/layout/sidebar/sidebar.module.scss";

import LogoutIcon from "../icons/interface/Logout";
import MenuItem from "./MenuItem";
import SidebarTop from "./SidebarTop";
import DoubleChevronLeft from "../icons/chevrons/DoubleChevronLeft.jsx";
import DoubleChevronRight from "../icons/chevrons/DoubleChevronRight.jsx";

export default function Sidebar({ menuItems }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuItemClick = (index, link) => {
    console.log("Menu item clicked:", index, link); // Debugging line to check the clicked item
    setActiveItem(index);
    if (link) navigate(link);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (err) { console.error("Logout failed", err); }
  };

  return (
    <div className={`${styles.sidebarContainer} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.top}><SidebarTop isOpen={isOpen} /></div>
      
      <div className={styles.btn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <DoubleChevronLeft /> : <DoubleChevronRight />}
      </div>
        <Link to="/user/incomses" className={styles.logo}>
          {isOpen ? "MyBudget" : "MB"}
        </Link>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            isOpen={isOpen}
            isActive={activeItem === index}
            onClick={() => handleMenuItemClick(index, item.link)}
          />
        ))}
      </ul>

      <div className={styles.logout} onClick={handleLogout}>
        <LogoutIcon />
        {isOpen && <p>Log out</p>}
      </div>
    </div>
  );
}