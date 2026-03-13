import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/layout/sidebar/menuItem.module.scss";
//import NotificationBell from "src/components/notifications/NotificationBell";

export default function MenuItem({ item, index, isOpen, activeItem, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(index);
  };

  const menuContent = (
    <div className={styles.item}>
      <div
        className={
          item.icon
            ? `${styles.menuIcon}`
            : item.component != undefined
            ? `${styles.menuIcon}`
            : null
        }
      >
        {item.icon
          ? React.cloneElement(item.icon, {
              fill: activeItem === index ? "#000" : "#e7e7e7",
            })
          : item.component != undefined
          ? item.component
          : null}
      </div>
      {isOpen && <span className={`${styles.menuText}`}>{item.label}</span>}
    </div>
  );

  const menuItemClasses = `${styles.menuItem} ${
    activeItem === index ? styles.active : ""
  } ${isOpen ? styles.open : styles.closed}`;

  if (item.link && !item.submenu) {
    return (
      <Link
        href={item.link}
        className={`${menuItemClasses} link`}
        onClick={handleClick}
      >
        {menuContent}
      </Link>
    );
  }

  return (
    <li className={menuItemClasses} onClick={handleClick}>
      {menuContent}
    </li>
  );
}
