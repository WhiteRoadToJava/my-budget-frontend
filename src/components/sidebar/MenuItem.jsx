import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/layout/sidebar/menuItem.module.scss";

export default function MenuItem({ item, isOpen, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.link;
  const menuItemClasses = [
    styles.menuItem,
    isActive ? styles.active : "",
    isOpen ? styles.open : styles.closed,
  ].filter(Boolean).join(" ");

  return (
    <li className={menuItemClasses}>
      <Link to={item.link} className={styles.linkWrapper} onClick={onClick}>
        <div className={styles.item}>
          <div className={styles.menuIcon}>
            {item.icon
              ? React.cloneElement(item.icon, {
                  fill: isActive ? "#0b1020" : "#aeb8cb",
                })
              : item.component || null}
          </div>
          {isOpen && <span className={styles.menuText}>{item.label}</span>}
        </div>
      </Link>
    </li>
  );
}