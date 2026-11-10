import React from "react";
import CurrencySelect from "./CurrencySelect";
import { pocketOf, pocketsOf } from "../../utils/accounts/pockets";
import { formatNumber } from "../../utils/formating";
import styles from "../../styles/inputs/amountWithCurrency.module.scss";
import i18n from "../../configuration/i18n";

// An amount with its currency (the account's currencies) and, under it, what is available
// in that currency. Looks like FormInput. onChange gets the input event, like FormInput.
const AmountWithCurrency = ({
  label, name = "amount", value, onChange, placeholder = "0", account, currency, onCurrencyChange,
  showAvailable = true, readOnly = false, hint,
}) => {
  const currencies = pocketsOf(account).map((p) => p.currency);
  const available = pocketOf(account, currency)?.totalBalance;
  const id = `amount-${name}`;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.row}>
        <input id={id} name={name} type="number" inputMode="decimal" min="0" step="0.01"
          placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
        <CurrencySelect currencies={currencies} value={currency} label={label} onChange={onCurrencyChange}
          selectClassName={styles.select} codeClassName={styles.code} />
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
      {showAvailable && available !== undefined && (
        <p className={styles.hint}>
          {i18n.t("currencies.available")}: {formatNumber(Number(available))} {currency}
        </p>
      )}
    </div>
  );
};

export default AmountWithCurrency;
