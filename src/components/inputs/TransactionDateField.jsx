import React from "react";
import Datepicker from "./Datepicker";
import { todayString } from "../../utils/transactions/transactionDate";
import i18n from "../../configuration/i18n";

const TransactionDateField = ({ value, onChange, className, labelClassName }) => (
  <div className={className}>
    <label className={labelClassName}>{i18n.t("transactionDate.label")}</label>
    <Datepicker value={value} onChange={onChange} max={todayString()} />
  </div>
);

export default TransactionDateField;