import React from "react";
import { format, parseISO } from "date-fns";
import Row from "../accounts/TransactionRow";
import styles from "../../styles/components/transactions/transactionList.module.scss";
import { groupByMonth } from "../../utils/transactions/transactionList";
import { formatNumber } from "../../utils/formating";
import { dateFnsLocale } from "../../utils/dates";
import i18n from "../../configuration/i18n";

// Transactions grouped by month, each month with its money in and out.
const TransactionList = ({ transactions, onSelect, showAccount = false, emptyText }) => {
  const groups = groupByMonth(transactions);
  const locale = dateFnsLocale(i18n.language);

  if (groups.length === 0) {
    return <p className={styles.empty}>{emptyText ?? i18n.t("account.noTransactions")}</p>;
  }

  return (
    <div className={styles.list}>
      {groups.map((group) => (
        <section key={group.key} className={styles.month} aria-labelledby={`month-${group.key}`}>
          <header className={styles.monthHeader}>
            <h3 id={`month-${group.key}`} className={styles.monthTitle}>
              {format(parseISO(`${group.key}-01`), "LLLL yyyy", { locale })}
            </h3>
            <p className={styles.monthTotals}>
              <span className={styles.in}>+{formatNumber(group.totalIn)}</span>
              <span className={styles.out}>−{formatNumber(group.totalOut)}</span>
            </p>
          </header>
          <ul className={styles.items}>
            {group.items.map((t) => (
              <li key={`${t.type}-${t.id}`}>
                <Row transaction={t} onClick={() => onSelect(t)} showAccount={showAccount} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default TransactionList;
