import React from "react";
import styles from "../../styles/components/account/row.module.scss";
const Row = ({ transaction, onClick }) => {
  return (
    <div
      className={styles.rowContainer}
      data-type={transaction.type}
      onClick={onClick}
    >
      <p>{transaction.amount.toFixed(2)}</p>
      <p>{transaction.category}</p>
      <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
      <p className={styles.transactionType} data-type={transaction.type}>
        {transaction.type}
      </p>
    </div>
  );
}; 

export default Row;
