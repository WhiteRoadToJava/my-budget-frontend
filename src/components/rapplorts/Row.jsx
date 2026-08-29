import React from "react";
import styles from "../../styles/rapport/row.module.scss"
import { formatNumber } from "../../utils/formating";
import { onEnterOrSpace } from "../../utils/accessibility";
const Row = ({ item, onClick }) => {
  return (
    <div
      className={styles.rowContainer}
      data-type={item.type}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onEnterOrSpace(onClick)}
    >
      <p>{formatNumber(item.amount)}</p>
      <p>{item.sourceAccount?.name}</p>
      {item.destinationAccount ?
        <p>{item.destinationAccount.name}</p> :
        <p> - </p>
      }
      <p>{new Date(item.createdAt).toLocaleDateString()}</p>
      <div className={styles.transactionType} data-type={item.type}>
        {item.type}
      </div>
    </div>
  );
}; 

export default Row;
