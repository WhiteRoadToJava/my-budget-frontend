import React from "react";
import styles from "../../styles/components/transfers/transferFees.module.scss";
import { transferEffects } from "../../utils/transactions/transferFees";
import { formatNumber } from "../../utils/formating";
import i18n from "../../configuration/i18n";

// What the transfer will do to each account, fees included, before saving.
const TransferSummary = ({ sourceId, destinationId, amountSent, amountReceived, fees, accounts }) => {
  if (!sourceId || !destinationId) return null;
  const effects = transferEffects({ sourceId, destinationId, amountSent, amountReceived, fees });
  if (effects.length === 0) return null;
  const accountOf = (id) => accounts.find((a) => a.id === id);

  return (
    <section className={styles.summary} aria-live="polite">
      <p className={styles.summaryTitle}>{i18n.t("transferFees.summaryTitle")}</p>
      <ul className={styles.summaryList}>
        {effects.map(({ accountId, amount }) => (
          <li key={accountId}>
            <span>{accountOf(accountId)?.name ?? accountId}</span>
            <span className={amount > 0 ? styles.in : styles.out}>
              {amount > 0 ? "+" : "−"}
              {formatNumber(Math.abs(amount))} {accountOf(accountId)?.currency ?? ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TransferSummary;
