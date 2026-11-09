import React from "react";
import CurrencySelect from "../inputs/CurrencySelect";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/transfers/transferFees.module.scss";
import { FEE_DIRECTIONS } from "../../utils/transactions/transferFees";
import { pocketsOf } from "../../utils/accounts/pockets";
import i18n from "../../configuration/i18n";

// One fee: amount in a currency of its side's account (default: the side's currency),
// and علينا / لنا. An old transfer may have its fee on a third account: it is kept and named.
const FeeFieldset = ({ prefix, legend, fees, onChange, sideAccount, sideCurrency, accounts }) => {
  const amountKey = `${prefix}Fee`;
  const directionKey = `${prefix}FeeDirection`;
  const currencyKey = `${prefix}FeeCurrency`;
  const otherAccount = fees[`${prefix}FeeAccountId`]
    ? accounts.find((a) => a.id === fees[`${prefix}FeeAccountId`])
    : null;
  const set = (key, value) => onChange({ ...fees, [key]: value });

  // the currencies of the account the fee is paid from
  const feeAccount = otherAccount ?? sideAccount;
  const currencies = pocketsOf(feeAccount).map((p) => p.currency);
  const currency = fees[currencyKey] || (otherAccount ? currencies[0] : sideCurrency) || "";

  return (
    <fieldset className={styles.fee}>
      <legend>{legend}</legend>

      <div className={sheet.field}>
        <label className={sheet.label} htmlFor={`${prefix}-fee`}>{i18n.t("transferFees.amount")}</label>
        <div className={sheet.money}>
          <input id={`${prefix}-fee`} type="number" inputMode="decimal" min="0" step="0.01" placeholder="0"
            value={fees[amountKey]} onChange={(e) => set(amountKey, e.target.value)} />
          <CurrencySelect currencies={currencies} value={currency} label={legend}
            onChange={(code) => set(currencyKey, code)} />
        </div>
        {otherAccount && (
          <p className={sheet.available}>{i18n.t("transferFees.fromAccount", { name: otherAccount.name })}</p>
        )}
      </div>

      <div className={styles.directions} role="radiogroup" aria-label={legend}>
        {FEE_DIRECTIONS.map((d) => (
          <label key={d.value} className={styles.direction}>
            <input type="radio" name={directionKey} value={d.value}
              checked={fees[directionKey] === d.value} onChange={() => set(directionKey, d.value)} />
            {i18n.t(d.label)}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

// fees: see utils/transactions/transferFees.js; the send fee is paid from the sending
// account, the receive fee from the receiving one
const TransferFeesFields = ({ fees, onChange, sourceAccount, sourceCurrency, destinationAccount, destinationCurrency, accounts = [] }) => (
  <div className={styles.fees}>
    <FeeFieldset prefix="send" legend={i18n.t("transferFees.sendFee")} fees={fees} onChange={onChange}
      sideAccount={sourceAccount} sideCurrency={sourceCurrency} accounts={accounts} />
    <FeeFieldset prefix="receive" legend={i18n.t("transferFees.receiveFee")} fees={fees} onChange={onChange}
      sideAccount={destinationAccount} sideCurrency={destinationCurrency} accounts={accounts} />
  </div>
);

export default TransferFeesFields;
