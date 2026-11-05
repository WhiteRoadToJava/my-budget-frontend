import React from "react";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import styles from "../../styles/components/transfers/transferFees.module.scss";
import { FEE_DIRECTIONS } from "../../utils/transactions/transferFees";
import i18n from "../../configuration/i18n";

// One fee: amount, علينا / لنا, and the account (empty = the account on its side).
const FeeFieldset = ({ prefix, legend, sideLabel, fees, onChange, accounts }) => {
  const amountKey = `${prefix}Fee`;
  const directionKey = `${prefix}FeeDirection`;
  const accountKey = `${prefix}FeeAccountId`;
  const set = (key, value) => onChange({ ...fees, [key]: value });

  const accountNames = [sideLabel, ...accounts.map((a) => a.name)];
  const chosen = accounts.find((a) => a.id === fees[accountKey]);

  return (
    <fieldset className={styles.fee}>
      <legend>{legend}</legend>

      <FormInput
        label={i18n.t("transferFees.amount")}
        name={amountKey}
        type="number"
        min="0"
        step="0.01"
        placeholder="0"
        value={fees[amountKey]}
        onChange={(e) => set(amountKey, e.target.value)}
      />

      <div className={styles.directions} role="radiogroup" aria-label={legend}>
        {FEE_DIRECTIONS.map((d) => (
          <label key={d.value} className={styles.direction}>
            <input
              type="radio"
              name={directionKey}
              value={d.value}
              checked={fees[directionKey] === d.value}
              onChange={() => set(directionKey, d.value)}
            />
            {i18n.t(d.label)}
          </label>
        ))}
      </div>

      <DropDown
        label={i18n.t("transferFees.account")}
        name={accountKey}
        list={accountNames}
        value={chosen ? chosen.name : sideLabel}
        onChange={(e) => set(accountKey, accounts.find((a) => a.name === e.target.value)?.id ?? "")}
      />
    </fieldset>
  );
};

// fees: see utils/transactions/transferFees.js; accounts: the user's accounts
const TransferFeesFields = ({ fees, onChange, accounts }) => (
  <div className={styles.fees}>
    <FeeFieldset
      prefix="send"
      legend={i18n.t("transferFees.sendFee")}
      sideLabel={i18n.t("transferFees.sameAsSource")}
      fees={fees}
      onChange={onChange}
      accounts={accounts}
    />
    <FeeFieldset
      prefix="receive"
      legend={i18n.t("transferFees.receiveFee")}
      sideLabel={i18n.t("transferFees.sameAsDestination")}
      fees={fees}
      onChange={onChange}
      accounts={accounts}
    />
  </div>
);

export default TransferFeesFields;
