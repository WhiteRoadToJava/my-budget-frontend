import styles from "../../styles/modals/modal.module.scss";
import i18n from "../../configuration/i18n";

export default function Modal({ children, isOpen, onClose, className }) {
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
