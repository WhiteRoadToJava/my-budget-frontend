import React from "react";
import SearchInput from "../inputs/SearchInput";
import styles from "../../styles/components/transactions/transactionFilters.module.scss";
import i18n from "../../configuration/i18n";

const TYPES = ["all", "income", "expense", "transfer", "debt"];

// type chips, "hide cancelled" and a search box; the parent keeps the values
// (without onHideCancelledChange the chip is not shown)
const TransactionFilters = ({ type, onTypeChange, query, onQueryChange, hideCancelled, onHideCancelledChange }) => (
  <div className={styles.filters}>
    <div className={styles.chips} role="group" aria-label={i18n.t("account.type")}>
      {TYPES.map((t) => (
        <button
          key={t}
          type="button"
          className={styles.chip}
          aria-pressed={type === t}
          onClick={() => onTypeChange(t)}
        >
          {i18n.t(`transactionsPage.filters.${t}`)}
        </button>
      ))}
      {onHideCancelledChange && (
        <button
          type="button"
          className={styles.chip}
          aria-pressed={hideCancelled}
          onClick={() => onHideCancelledChange(!hideCancelled)}
        >
          {i18n.t("cancel.hide")}
        </button>
      )}
    </div>
    <div className={styles.search}>
      <SearchInput
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={i18n.t("transactionsPage.search")}
        aria-label={i18n.t("transactionsPage.search")}
      />
    </div>
  </div>
);

export default TransactionFilters;
