import React from "react";
import Datepicker from "./Datepicker";
import { todayString } from "../../utils/transactions/transactionDate";
import i18n from "../../configuration/i18n";

// min ("yyyy-MM-dd", optional): the first day that can be picked
const TransactionDateField = ({ value, onChange, min, className, labelClassName }) => (
  <div className={className}>
    <label className={labelClassName}>{i18n.t("transactionDate.label")}</label>
    <Datepicker value={value} onChange={onChange} min={min} max={todayString()} />
  </div>
);

export default TransactionDateField;