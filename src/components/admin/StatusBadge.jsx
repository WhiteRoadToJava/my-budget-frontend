import React from "react";
import styles from "../../styles/components/admin/admin.module.scss";
import i18n from "../../configuration/i18n";

const StatusBadge = ({ status }) => (
  <span className={styles.badge} data-status={status}>
    {i18n.t(`admin.status.${status ?? "NONE"}`)}
  </span>
);

export default StatusBadge;
