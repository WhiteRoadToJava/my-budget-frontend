import React from "react";
import { parseISO } from "date-fns";
import styles from "../../styles/components/debts/debtDetails.module.scss";
import { formatNumber } from "../../utils/formating";
import { intervalLabelKey, paymentStatusKey } from "../../utils/debts/debtSchedules";
import { onEnterOrSpace } from "../../utils/accessibility";
import i18n from "../../configuration/i18n";

// recurring payments of one debt; a click opens the normal schedule details
// (pause / resume / edit / delete live there)
const DebtSchedulesList = ({ schedules, debt, onSelect }) => {
  if (schedules.length === 0) {
    return <p className={styles.empty}>{i18n.t("debts.noRecurringPayments")}</p>;
  }

  return (
    <ul className={styles.scheduleList}>
      {schedules.map((s) => {
        const statusKey = paymentStatusKey(s, debt);
        return (
          <li
            key={s.id}
            className={styles.scheduleItem}
            data-active={s.isActive !== false}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(s)}
            onKeyDown={onEnterOrSpace(() => onSelect(s))}
          >
            <span className={styles.value}>
              {formatNumber(s.amountSend)} {debt.currency}
            </span>
            <span>{i18n.t(intervalLabelKey(s.scheduleInterval) ?? s.scheduleInterval)}</span>
            <span className={styles.label}>
              {s.isActive !== false && s.executionDate
                ? i18n.t("debts.nextPayment", {
                    date: parseISO(s.executionDate).toLocaleDateString(),
                  })
                : ""}
            </span>
            <span className={styles.label}>{s.sourceAccount?.name}</span>
            <span className={styles.badge}>{i18n.t(statusKey)}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default DebtSchedulesList;
