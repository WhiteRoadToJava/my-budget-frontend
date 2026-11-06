import React from "react";
import styles from "../../styles/components/overview/overview.module.scss";
import CurrencyChips from "./CurrencyChips";
import { formatMoney } from "../../utils/accounts/accountStatement";
import i18n from "../../configuration/i18n";

// where the money went this month: the biggest expense categories
const TopCategories = ({ categories, currency, currencies, onCurrencyChange }) => {
  const max = Math.max(...categories.map((c) => c.amount), 0);
  return (
    <section className={styles.card} aria-labelledby="overview-top">
      <div className={styles.cardHeader}>
        <h2 id="overview-top" className={styles.cardTitle}>{i18n.t("overview.topExpenses")}</h2>
        <CurrencyChips currencies={currencies} value={currency} onChange={onCurrencyChange} />
      </div>
      {categories.length === 0 ? (
        <p className={styles.empty}>{i18n.t("overview.noExpenses")}</p>
      ) : (
        <ul className={styles.bars}>
          {categories.map((c) => (
            <li key={c.name} className={styles.barRow}>
              <span className={styles.barName}>{c.name}</span>
              <span className={styles.barTrack} aria-hidden="true">
                <span className={styles.barFill} style={{ display: "block", width: `${max ? (c.amount / max) * 100 : 0}%` }} />
              </span>
              <span className={styles.barAmount}>{formatMoney(c.amount, i18n.language)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TopCategories;
