"use client";

import Logout from "../icons/interface/Logout";
import styles from "../../styles/layout/sidebar/sidebar.module.scss";
import React, { useState, useEffect, useRef } from "react";
import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";
import SidebarTop from "./SidebarTop";
import DoubleChevronLeft from "../icons/chevrons/DoubleChevronLeft.jsx";
import DoubleChevronRight from "../icons/chevrons/DoubleChevronRight.jsx";


export default function Sidebar({ menuItems }) {
 const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : true);

  const hasHydrated = useRef(false);

  const [isOpen, setIsOpen] = useState(isLargeScreen);
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  

  useEffect(() => {
    if (typeof window !== "undefined") {
      hasHydrated.current = true;

      if (!isLargeScreen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (hasHydrated.current) {
      setIsOpen(isLargeScreen);
    }
  }, [isLargeScreen]);

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.success) {
        console.log("Logged out!");
        router.push("/auth/login");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuItemClick = (index) => {
    setActiveItem(index);
    if (menuItems[index].submenu) {
      setOpenSubMenu(openSubMenu === index ? null : index);
      setActiveSubItem(null);
    } else {
      setOpenSubMenu(null);
    }
  };

  /* const handleSubMenuItemClick = (index) => {
    setActiveSubItem(index);
  }; */

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
      <div
        className={`${styles.sidebarContainer} ${
          isOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.top}>
          <SidebarTop isOpen={isOpen} />
        </div>

        <div className={styles.btn}>
          <div
            className={`${styles.toggleButton} ${
              isOpen ? styles.bounceLeft : styles.bounceRight
            }`}
            onClick={handleToggleSidebar}
          >
            {isOpen ? (
              <DoubleChevronLeft className={styles.chevronLeft} />
            ) : (
              <DoubleChevronRight className={styles.chevronRight} />
            )}
          </div>
        </div>

        <ul className={styles.menu}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <MenuItem
                item={item}
                index={index}
                isOpen={isOpen}
                activeItem={activeItem}
                onClick={handleMenuItemClick}
              />
              {/*{item.submenu && openSubMenu === index && isOpen && (
                <ul className={styles.subMenu}>
                  {item.submenu.map((subItem, subIndex) => (
                    <SubMenuItem
                      key={subIndex}
                      subItem={subItem}
                      index={subIndex}
                      activeSubItem={activeSubItem}
                      onClick={handleSubMenuItemClick}
                    />
                  ))}
                </ul>
              )} */}
            </React.Fragment>
          ))}
        </ul>

        <div className={styles.logout} onClick={handleLogout}>
          <Logout />
          {isOpen && <p>Log out</p>}
        </div>
      </div>
  );
}
