import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/layout/sidebar/menuItem.module.scss";

export default function MenuItem({ item, isOpen }) {
  const location = useLocation();
  
  // التحقق مما إذا كان هذا الرابط هو النشط حالياً بناءً على المسار في المتصفح
  const isActive = location.pathname === item.link;

  const menuItemClasses = `${styles.menuItem} ${
    isActive ? styles.active : ""
  } ${isOpen ? styles.open : styles.closed}`;

  const menuContent = (
    <div className={styles.item}>
      <div className={styles.menuIcon}>
        {item.icon
          ? React.cloneElement(item.icon, {
              // تغيير اللون بناءً على حالة النشاط
              fill: isActive ? "#000" : "#e7e7e7",
            })
          : item.component || null}
      </div>
      {isOpen && <span className={styles.menuText}>{item.label}</span>}
    </div>
  );

  // الحل الجذري: استخدام "to" بدلاً من "href"
  return (
    <li className={menuItemClasses}>
      <Link to={item.link} className={styles.linkWrapper} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
        {menuContent}
      </Link>
    </li>
  );
}