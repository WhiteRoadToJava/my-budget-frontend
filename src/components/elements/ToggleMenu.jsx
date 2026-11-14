import React, { useState } from 'react'
import Modal from "../modals/Modal";
import styles from "../../styles/components/elements/ToggleMenu.module.scss";
import i18n from "../../configuration/i18n";

const ToggleMenu = ({ menuList }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر النقاط الثلاث */}
      <button
        type="button"
        className={styles.dotsTrigger}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label={i18n.t("buttons.moreOptions")}
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </button>

      {/* نافذة الخيارات */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className={styles.optionsModal}
      >
        <div role="menu" className={styles.optionsList}>
          {menuList.map((item, index) => (
            <div
              key={index}
              role="menuitem"
              className={styles.optionItem}
              onClick={() => setIsOpen(false)}
            >
              {item}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ToggleMenu;
