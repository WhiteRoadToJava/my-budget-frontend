import React from "react";
import styles from "../../styles/components/accounts/row.module.scss";
const Row = ({ account }) => {
  return (
    <div className={styles.rowContainer}>
      <span>{account.name}</span>
      <span
        className={`
    ${styles.balance} 
    ${account.balance >= 0 ? styles.plusValue : styles.minusValue}
  `}
      >
        {account.balance}
      </span>
      <span>{account.currency}</span>
      <span>{account.type}</span>
    </div>
  );
};

export default Row;
