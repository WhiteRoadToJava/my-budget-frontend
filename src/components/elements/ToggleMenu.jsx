import React, { useState, useEffect, useRef} from 'react'
import styles from "../../styles/components/elements/ToggleMenu.module.scss";




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
      <div 
        className={styles.dotsTrigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className={styles.menu} data-position={position}>
          {menuList.map((item, index) => (
            <div 
              key={index} 
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