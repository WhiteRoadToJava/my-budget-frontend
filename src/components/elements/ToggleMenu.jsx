import React, { useState, useEffect, useRef} from 'react'
import styles from "../../styles/components/elements/ToggleMenu.module.scss";
import i18n from "../../configuration/i18n";




const ToggleMenu = ({ menuList , position}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.toggleMenuContainer} ref={menuRef}>
      {/* زر النقاط الثلاث */}
      <button
        type="button"
        className={styles.dotsTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={i18n.t("buttons.moreOptions")}
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className={styles.menu} data-position={position} role="menu">
          {menuList.map((item, index) => (
            <div
              key={index}
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;