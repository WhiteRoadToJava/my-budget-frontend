import React from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/details/detailsSheet.module.scss";

// Shared layout for the transaction and schedule details:
// header (icon, title, amount), a list of facts, optional extra content,
// and the actions visible at the bottom instead of hidden in a menu.
// tone colours the edge and the amount: "in" | "out" | "transfer" | "debt"
const DetailsSheet = ({
  isOpen,
  onClose,
  tone,
  icon,
  kicker,
  title,
  amount,
  fields = [],
  note,
  error,
  children,
  actions,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className={styles.sheet}>
    <div className={styles.inner} data-tone={tone}>
      <header className={styles.header}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            <img src={icon} alt="" />
          </span>
        )}
        <div className={styles.heading}>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <h2 className={styles.title}>{title}</h2>
        </div>
      </header>

      {amount && <p className={styles.amount}>{amount}</p>}

      {note && (
        <p className={styles.note} role="note">
          {note}
        </p>
      )}

      <dl className={styles.facts}>
        {fields
          .filter((f) => f.value !== undefined && f.value !== null && f.value !== "")
          .map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
      </dl>

      {children}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  </Modal>
);

export default DetailsSheet;
