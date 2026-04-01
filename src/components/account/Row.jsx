import React from "react";
import styles from "../../styles/components/account/row.module.scss";
const Row = ({ transaction, onClick }) => {
  return (
    <div
      className={styles.rowContainer}
      data-type={transaction.type}
      onClick={onClick}
    >
      <p>{transaction.amount}</p>
      <p>{transaction.category}</p>
    </div>
  );
};

export default Row;
