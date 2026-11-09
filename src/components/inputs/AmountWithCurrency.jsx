import React from "react";
import CurrencySelect from "./CurrencySelect";
import { pocketOf, pocketsOf } from "../../utils/accounts/pockets";
import { formatNumber } from "../../utils/formating";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// An amount with the currency next to it (the account's currencies) and, under it,
// what is available in that currency. onChange gets the input event, like FormInput.
const AmountWithCurrency = ({ label, name = "amount", value, onChange, placeholder = "0", account, currency, onCurrencyChange, showAvailable = true }) => {
  const currencies = pocketsOf(account).map((p) => p.currency);
  const available = pocketOf(account, currency)?.totalBalance;
  const id = `amount-${name}`;
  return (
    <div className={sheet.field}>
      <label className={sheet.label} htmlFor={id}>{label}</label>
      <div className={sheet.money}>
        <input id={id} name={name} type="number" inputMode="decimal" min="0" step="0.01"
          placeholder={placeholder} value={value} onChange={onChange} />
        <CurrencySelect currencies={currencies} value={currency} label={label} onChange={onCurrencyChange} />
      </div>
      {showAvailable && available !== undefined && (
        <p className={sheet.available}>
          {i18n.t("currencies.available")}: {formatNumber(Number(available))} {currency}
        </p>
      )}
    </div>
  );
};

export default AmountWithCurrency;
