import React from "react";
import styles from "../../styles/components/schedule/row.module.scss";
import { formatNumber } from "../../utils/formating";
import { onEnterOrSpace } from "../../utils/accessibility";
const Row = ({ schedule, onClick }) => {
  return (
    <div
      className={styles.rowContainer}
      data-type={schedule.transactionType}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onEnterOrSpace(onClick)}
    >
      <p>{formatNumber(schedule.amountSend)}</p>
      <p>{schedule.name}</p>
      <p>{schedule.scheduleInterval}</p>
      <p>{new Date(schedule.executionDate).toLocaleDateString()}</p>
      <p className={styles.transactionType} data-type={schedule.transactionType}>
        {schedule.transactionType}
      </p>
    </div>
  );
}; 

export default Row;
