import React from "react";
import styles from "../../styles/components/overview/overview.module.scss";
import i18n from "../../configuration/i18n";

// shown only when there is more than one currency to choose from
const CurrencyChips = ({ currencies, value, onChange }) =>
  currencies.length > 1 ? (
    <div className={styles.chips} role="group" aria-label={i18n.t("share.currency")}>
      {currencies.map((c) => (
        <button key={c} type="button" className={styles.chip} aria-pressed={value === c} onClick={() => onChange(c)}>
          {c}
        </button>
      ))}
    </div>
  ) : null;

export default CurrencyChips;
