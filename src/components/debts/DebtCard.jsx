import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/debts/debts.module.scss";
import { formatNumber } from "../../utils/formating";
import { isSettled, remainingOf } from "../../utils/debts/summarizeDebts";
import i18n from "../../configuration/i18n";

const DebtCard = ({ debt }) => {
  const settled = isSettled(debt);
  const directionLabel =
    debt.direction === "OWED_BY_ME" ? i18n.t("debts.owedByMe") : i18n.t("debts.owedToMe");

  return (
    <Link to={`/user/debts/${debt.id}`} className={styles.card} data-settled={settled}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardName}>{debt.name}</p>
          {debt.counterparty && <p className={styles.cardCounterparty}>{debt.counterparty}</p>}
        </div>
        <span className={styles.badge} data-direction={debt.direction}>
          {settled ? i18n.t("debts.settled") : directionLabel}
        </span>
      </div>

      <p className={styles.cardAmount}>
        {formatNumber(remainingOf(debt))} {debt.currency}
      </p>

      <div className={styles.cardMeta}>
        <span>{i18n.t("debts.totalOwed")}</span>
        {debt.annualRate > 0 && (
          <span>{i18n.t("debts.ratePerYear", { rate: debt.annualRate })}</span>
        )}
      </div>
    </Link>
  );
};

export default DebtCard;
