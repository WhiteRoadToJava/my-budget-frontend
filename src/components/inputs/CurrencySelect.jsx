import React from "react";
import sheet from "../../styles/components/forms/formSheet.module.scss";

// The currency next to an amount: a list of the account's currencies, or just the code
// when the account has one. The classes default to the big amount of the form sheets.
const CurrencySelect = ({ currencies = [], value, onChange, label, id, selectClassName, codeClassName }) => {
  if (currencies.length <= 1) {
    return <span className={codeClassName ?? sheet.moneyCurrency}>{value || currencies[0] || ""}</span>;
  }
  return (
    <select id={id} aria-label={label} className={selectClassName ?? sheet.moneySelect} value={value}
      onChange={(e) => onChange(e.target.value)}>
      {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
};

export default CurrencySelect;
