import React from "react";
import CurrencyFlag from "./CurrencyFlag";
import { currencyName } from "../../utils/currencies/currencyNames";
import i18n from "../../configuration/i18n";

// 🇸🇪 SEK, or with withName: 🇸🇪 SEK — Swedish Krona (the name in the user's language)
const CurrencyLabel = ({ code, withName = false }) => {
  const name = withName ? currencyName(code, i18n.language) : null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", minWidth: 0 }}>
      <CurrencyFlag code={code} />
      <span>{code}{name && name !== code ? ` — ${name}` : ""}</span>
    </span>
  );
};

export default CurrencyLabel;