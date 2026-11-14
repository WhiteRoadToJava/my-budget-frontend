import React from "react";
import styles from "../../styles/components/debts/debts.module.scss";
import { formatNumber } from "../../utils/formating";
import i18n from "../../configuration/i18n";

// one card per currency: what I owe, what I am owed, and the difference
const DebtsSummary = ({ totals }) => {
  if (totals.length === 0) return null;

  return (
    <section className={styles.summaryGrid} aria-label={i18n.t("debts.summary")}>
      {totals.map((t) => (
        <div key={t.currency} className={styles.summaryCard}>
          <span className={styles.summaryCurrency}>{t.currency}</span>
          <div className={styles.summaryLine}>
            <span>{i18n.t("debts.owedByMe")}</span>
            <span className={styles.amountOut}>{formatNumber(t.owedByMe)}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>{i18n.t("debts.owedToMe")}</span>
            <span className={styles.amountIn}>{formatNumber(t.owedToMe)}</span>
          </div>
          <div className={styles.summaryLine}>
            <strong>{i18n.t("debts.net")}</strong>
            <strong className={t.net < 0 ? styles.amountOut : styles.amountIn}>
              {formatNumber(t.net)}
            </strong>
          </div>
        </div>
      ))}
    </section>
  );
};

export default DebtsSummary;
