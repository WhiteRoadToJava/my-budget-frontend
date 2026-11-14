import React from "react";
import styles from "../../styles/components/transfers/transferFees.module.scss";
import { transferEffects } from "../../utils/transactions/transferFees";
import { formatNumber } from "../../utils/formating";
import { firstCurrency } from "../../utils/accounts/pockets";
import i18n from "../../configuration/i18n";

// What the transfer will do to each account, fees included, before saving.
// one line per pocket (account + currency); an exchange shows two lines of the same account
const TransferSummary = ({
  sourceId, sourceCurrency, destinationId, destinationCurrency, amountSent, amountReceived, fees, accounts,
}) => {
  if (!sourceId || !destinationId) return null;
  const accountOf = (id) => accounts.find((a) => a.id === id);
  const effects = transferEffects({
    sourceId, sourceCurrency: sourceCurrency || firstCurrency(accountOf(sourceId)),
    destinationId, destinationCurrency: destinationCurrency || firstCurrency(accountOf(destinationId)),
    amountSent, amountReceived, fees,
    feeCurrencyOf: (id) => firstCurrency(accountOf(id)),
  });
  if (effects.length === 0) return null;

  return (
    <section className={styles.summary} aria-live="polite">
      <p className={styles.summaryTitle}>{i18n.t("transferFees.summaryTitle")}</p>
      <ul className={styles.summaryList}>
        {effects.map(({ accountId, currency, amount }) => (
          <li key={`${accountId}|${currency}`}>
            <span>{accountOf(accountId)?.name ?? accountId}</span>
            <span className={amount > 0 ? styles.in : styles.out}>
              {amount > 0 ? "+" : "−"}
              {formatNumber(Math.abs(amount))} {currency}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TransferSummary;
