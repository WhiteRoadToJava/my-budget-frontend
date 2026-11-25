import AmountWithCurrency from "../inputs/AmountWithCurrency";
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

      <AmountWithCurrency
        label={i18n.t("transferFees.amount")}
        name={`${prefix}Fee`}
        value={fees[amountKey]}
        onChange={(e) => set(amountKey, e.target.value)}
        account={feeAccount}
        currency={currency}
        onCurrencyChange={(code) => set(currencyKey, code)}
        showAvailable={false}
        hint={otherAccount ? i18n.t("transferFees.fromAccount", { name: otherAccount.name }) : undefined}
      />

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
// One side's fee alone, for forms that show each fee under its own side.
// side: "send" (paid from the sending account) or "receive" (from the receiving one)
export const TransferFeeField = ({ side, fees, onChange, account, currency, accounts = [] }) => (
  <FeeFieldset prefix={side} legend={i18n.t(`transferFees.${side}Fee`)} fees={fees} onChange={onChange}
    sideAccount={account} sideCurrency={currency} accounts={accounts} />
);

// fees: see utils/transactions/transferFees.js; both fees together (the update form)
const TransferFeesFields = ({ fees, onChange, sourceAccount, sourceCurrency, destinationAccount, destinationCurrency, accounts = [] }) => (
  <div className={styles.fees}>
    <TransferFeeField side="send" fees={fees} onChange={onChange}
      account={sourceAccount} currency={sourceCurrency} accounts={accounts} />
    <TransferFeeField side="receive" fees={fees} onChange={onChange}
      account={destinationAccount} currency={destinationCurrency} accounts={accounts} />
  </div>
);

export default TransferFeesFields;