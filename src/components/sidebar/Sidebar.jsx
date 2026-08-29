import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import styles from "../../styles/layout/sidebar/sidebar.module.scss";
import LogoutIcon from "../icons/interface/Logout";
import Close from "../icons/interface/Close";
import MenuItem from "./MenuItem";
import SidebarTop from "./SidebarTop";
import DoubleChevronLeft from "../icons/chevrons/DoubleChevronLeft.jsx";
import DoubleChevronRight from "../icons/chevrons/DoubleChevronRight.jsx";
import i18n from "../../configuration/i18n.js";
import { onEnterOrSpace } from "../../utils/accessibility";

export default function Sidebar({ menuItems, isMobileOpen = false, onMobileClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // امنع سكرول الصفحة اللي وراء الـ drawer وهو مفتوح على الموبايل
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleMenuItemClick = (index, link) => {
    setActiveItem(index);
    if (link) navigate(link);
    onMobileClose?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
      onMobileClose?.();
    } catch (err) { console.error(i18n.t("logoutError"), err); }
  };

  // على الموبايل الـ drawer دايماً بيبان كامل (أيقونة + نص)، بغض النظر
  // عن حالة الطي المستقلة المستخدمة على الديسكتوب (isOpen).
  const showFullContent = isOpen || isMobileOpen;

  return (
    <>
      <div
        className={`${styles.backdrop} ${isMobileOpen ? styles.visible : ""}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.sidebarContainer} ${showFullContent ? styles.open : styles.closed} ${isMobileOpen ? styles.mobileOpen : ""}`}
      >
        <div className={styles.top}><SidebarTop isOpen={showFullContent} /></div>

        <button
          type="button"
          className={styles.btn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={i18n.t(isOpen ? "sidebar.collapseMenu" : "sidebar.expandMenu")}
        >
          {isOpen ? <DoubleChevronLeft  /> : <DoubleChevronRight />}
        </button>

        <button
          type="button"
          className={styles.mobileClose}
          onClick={onMobileClose}
          aria-label={i18n.t("sidebar.closeMenu")}
        >
          <Close />
        </button>

        <div className={styles.menuContainer}>
        <ul className={styles.menu}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              isOpen={showFullContent}
              isActive={activeItem === index}
              onClick={() => handleMenuItemClick(index, item.link)}
            />
          ))}
        </ul>
        </div>

        <div
          className={styles.logout}
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={onEnterOrSpace(handleLogout)}
        >
          <LogoutIcon />
          {showFullContent && <p>{i18n.t("sidebar.logout")}</p>}
        </div>
      </div>
    </>
  );
}