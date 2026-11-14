import React from "react";
import styles from "../../styles/components/overview/overview.module.scss";
import { totalsByCurrency } from "../../utils/accounts/accountList";
import { formatMoney } from "../../utils/accounts/accountStatement";
import i18n from "../../configuration/i18n";

// what the user holds now, per currency (active accounts only)
const BalancesStrip = ({ activeAccounts }) => {
  const totals = totalsByCurrency(activeAccounts);
  if (totals.length === 0) return null;
  return (
    <section className={styles.balances} aria-label={i18n.t("overview.balances")}>
      {totals.map((t) => (
        <p key={t.currency} className={styles.balance}>
          <span className={`${styles.balanceAmount} ${t.total < 0 ? styles.negative : ""}`}>
            {t.total < 0 ? "−" : ""}
            {formatMoney(t.total, i18n.language)}
          </span>
          <span className={styles.muted}>{t.currency}</span>
        </p>
      ))}
      <p className={styles.count}>{i18n.t("accountsPage.activeCount", { count: activeAccounts.length })}</p>
    </section>
  );
};

export default BalancesStrip;
