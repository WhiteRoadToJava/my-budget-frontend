import React from "react";
import styles from "../../styles/components/overview/overview.module.scss";
import { formatMoney } from "../../utils/accounts/accountStatement";
import i18n from "../../configuration/i18n";

// money in, out and net this month, one row per currency
const MonthSummary = ({ totals }) => {
  const currencies = Object.keys(totals);
  return (
    <section className={styles.card} aria-labelledby="overview-month">
      <h2 id="overview-month" className={styles.cardTitle}>{i18n.t("overview.thisMonth")}</h2>
      {currencies.length === 0 ? (
        <p className={styles.empty}>{i18n.t("overview.noActivity")}</p>
      ) : (
        currencies.map((currency) => {
          const t = totals[currency];
          return (
            <div key={currency} className={styles.month}>
              <div className={styles.stat}>
                <span className={styles.muted}>{i18n.t("share.moneyIn")} · {currency}</span>
                <span className={`${styles.statValue} ${styles.in}`}>+ {formatMoney(t.in, i18n.language)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.muted}>{i18n.t("share.moneyOut")} · {currency}</span>
                <span className={`${styles.statValue} ${styles.out}`}>− {formatMoney(t.out, i18n.language)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.muted}>{i18n.t("overview.net")} · {currency}</span>
                <span className={`${styles.statValue} ${t.net < 0 ? styles.negative : styles.in}`}>
                  {t.net < 0 ? "− " : "+ "}{formatMoney(t.net, i18n.language)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

export default MonthSummary;
