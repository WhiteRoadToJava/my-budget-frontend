import React from "react";
import { parseISO } from "date-fns";
import styles from "../../styles/components/debts/debtDetails.module.scss";
import { formatNumber } from "../../utils/formating";
import i18n from "../../configuration/i18n";

// the numbers DebtCalculator returns, as of today (summary.asOf)
const ITEMS = [
  { key: "totalOwed", label: "debts.totalOwed", main: true },
  { key: "principal", label: "debts.principal" },
  { key: "accruedInterest", label: "debts.accruedInterest" },
  { key: "totalDisbursed", label: "debts.totalDisbursed" },
  { key: "totalRepaid", label: "debts.totalRepaid" },
  { key: "interestPaid", label: "debts.interestPaid" },
];

const DebtSummaryCards = ({ summary, currency }) => {
  if (!summary) return null;

  return (
    <section aria-label={i18n.t("debts.summary")}>
      <div className={styles.summaryGrid}>
        {ITEMS.map((item) => (
          <div key={item.key} className={styles.summaryItem} data-main={!!item.main}>
            <span className={styles.label}>{i18n.t(item.label)}</span>
            <span className={styles.value}>
              {formatNumber(summary[item.key] ?? 0)} {currency}
            </span>
          </div>
        ))}
      </div>
      {summary.asOf && (
        <p className={styles.asOf}>
          {i18n.t("debts.asOf", { date: parseISO(summary.asOf).toLocaleDateString() })}
        </p>
      )}
    </section>
  );
};

export default DebtSummaryCards;
