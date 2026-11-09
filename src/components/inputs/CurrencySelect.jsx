import React from "react";
import sheet from "../../styles/components/forms/formSheet.module.scss";

// The currency next to an amount: a list of the account's currencies, or just the code
// when the account has one.
const CurrencySelect = ({ currencies = [], value, onChange, label, id }) => {
  if (currencies.length <= 1) {
    return <span className={sheet.moneyCurrency}>{value || currencies[0] || ""}</span>;
  }
  return (
    <select id={id} aria-label={label} className={sheet.moneySelect} value={value}
      onChange={(e) => onChange(e.target.value)}>
      {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
};

export default CurrencySelect;
