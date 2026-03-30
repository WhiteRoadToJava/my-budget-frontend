import React from "react";
import styles from "../../styles/components/account/row.module.scss";
const Row = ({ transaction }) => {
  return (
    <div className={styles.rowContainer} data-type={transaction.type}>
      <p>{transaction.amount}</p>
      <p>{transaction.category}</p>
    </div>
  );
};

export default Row;
