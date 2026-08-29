import { useEffect } from "react";
import styles from "../../styles/modals/modal.module.scss";
import i18n from "../../configuration/i18n";

export default function Modal({ children, isOpen, onClose, className }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={className} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={i18n.t("buttons.close")}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
